using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using NSubstitute;
using ResourceServer.Controllers;
using ResourceServer.Data.DTO;
using ResourceServer.Data.Models;
using ResourceServer.Data.Repositories;
using ResourceServer.Data.Security;
using System.Security.Claims;
using System.Text.Json;

namespace ResourcesServes.Tests.Controllers;

[TestClass]
public class OrderControllerTests
{
	private IOrderRepository _repository;
	private IOrderStatusRepository _statusRepository;
	private IHubContext<NotificationsHub> _hubContext;
	private OrderController _controller;

	[TestInitialize]
	public void Setup()
	{
		_repository = Substitute.For<IOrderRepository>();
		_statusRepository = Substitute.For<IOrderStatusRepository>();
		_hubContext = Substitute.For<IHubContext<NotificationsHub>>();
		_controller = new OrderController(_repository, _statusRepository, _hubContext);
	}

	[TestMethod]
	public void GetAll_ShouldReturnOkResult_WhenRepositoryReturnsListOfOrders()
	{
		var orders = GetOrders();
		_repository.GetAll().Returns(orders);

		var actionResult = _controller.GetAll();

		var okResult = actionResult.Result as OkObjectResult;
		Assert.IsNotNull(okResult, "Expected an OkObjectResult");
		var returnedOrders = okResult.Value as IEnumerable<Order>;
		Assert.IsNotNull(returnedOrders, "Expected a list of Order");
		CollectionAssert.AreEqual(new List<Order>(orders), new List<Order>(returnedOrders));
	}

	[TestMethod]
	public void GetById_ShouldReturnOkResult_WhenOrderExists()
	{
		var order = GetOrder();
		_repository.GetById(1).Returns(order);

		var actionResult = _controller.GetById(1);

		var okResult = actionResult.Result as OkObjectResult;
		Assert.IsNotNull(okResult, "Expected an OkObjectResult");
		var returnedOrder = okResult.Value as Order;
		Assert.IsNotNull(returnedOrder, "Expected an Order");
		Assert.AreEqual(order.Id, returnedOrder.Id, "Order Id should match");
	}

	[TestMethod]
	public void GetById_ShouldReturnNotFound_WhenOrderDoesNotExist()
	{
		_repository.GetById(1).Returns((Order)null);

		var actionResult = _controller.GetById(1);

		Assert.IsInstanceOfType<NotFoundResult>(actionResult.Result, "Expected a NotFoundResult");
	}

	[TestMethod]
	public void GetUserOrders_ShouldReturnOkResult_WhenUserOrdersExist()
	{
		var order = GetOrder();
		List<OrderGetDto> expectedOrders = [GetOrderGetDto()];
		_repository.GetUserOrders(Guid.Parse(order.AccountId)).Returns([order]);
		SetJwtUser(_controller, Guid.Parse(order.AccountId));

		var actionResult = _controller.GetOrders(Guid.Parse(order.AccountId));
		var okResult = actionResult.Result as OkObjectResult;

		Assert.IsNotNull(okResult, "Expected an OkObjectResult");
		var returnedOrders = (okResult.Value as IEnumerable<OrderGetDto>)!.ToList();
		Assert.IsNotNull(returnedOrders, "Expected a list of Order");
		CollectionAssert.AreEqual(expectedOrders, returnedOrders);
	}

	[TestMethod]
	public void Create_ShouldReturnCreatedAtActionResult_WhenOrderCreated()
	{
		var newOrder = GetOrderCreateDto();
		var createdOrder = GetOrder();
		_repository.Add(newOrder, Guid.Parse(createdOrder.AccountId)).Returns(createdOrder);

		SetJwtUser(_controller);

		var actionResult = _controller.Create(newOrder);

		var createdAtActionResult = actionResult.Result as CreatedAtActionResult;
		Assert.IsNotNull(createdAtActionResult, "Expected a CreatedAtActionResult");
		Assert.AreEqual(nameof(_controller.GetById), createdAtActionResult.ActionName, "Expected action name to be GetById");
		var returnedOrder = createdAtActionResult.Value as Order;
		Assert.IsNotNull(returnedOrder, "Expected an Order");
		Assert.AreEqual(createdOrder.Id, returnedOrder.Id, "Created order Id should match");
	}

	[TestMethod]
	public void Update_ShouldReturnNoContent_WhenOrderExists()
	{
		var orderToUpdate = GetOrder();
		_repository.Update(1, orderToUpdate).Returns(true);

		var result = _controller.Update(1, orderToUpdate);

		Assert.IsInstanceOfType<NoContentResult>(result, "Expected a NoContentResult");
	}

	[TestMethod]
	public void Update_ShouldReturnNotFound_WhenOrderDoesNotExist()
	{
		var orderToUpdate = GetOrder();
		_repository.Update(1, orderToUpdate).Returns(false);

		var result = _controller.Update(1, orderToUpdate);

		Assert.IsInstanceOfType<NotFoundResult>(result, "Expected a NotFoundResult");
	}

	[TestMethod]
	public void Delete_ShouldReturnNoContent_WhenOrderExists()
	{
		_repository.Delete(1).Returns(true);

		var result = _controller.Delete(1);

		Assert.IsInstanceOfType<NoContentResult>(result, "Expected a NoContentResult");
	}

	[TestMethod]
	public void Delete_ShouldReturnNotFound_WhenOrderDoesNotExist()
	{
		_repository.Delete(1).Returns(false);

		var result = _controller.Delete(1);

		Assert.IsInstanceOfType<NotFoundResult>(result, "Expected a NotFoundResult");
	}

	private static readonly DateTime ConstantNow = DateTime.UtcNow;

	private static Order GetOrder() => GetOrders().First();

	private static List<Order> GetOrders() =>
	[
		new Order
		{
			Id = 1,
			Status = new OrderStatus
			{
				Id = 1,
				Name = "Pending"
			},
			AccountId = "b495d8c6-46ed-470d-ba20-507cd1e4e509",
			Address = "123 Main St",
			OrderTime = ConstantNow
		},
		new Order
		{
			Id = 2,
			Status = new OrderStatus
			{
				Id = 1,
				Name = "Pending"
			},
			AccountId = "aa6e7309-d53c-481e-b179-e13fdfaf6c47",
			Address = "456 Elm St",
			OrderTime = ConstantNow
		}
	];

	private static OrderCreateDto GetOrderCreateDto() => GetOrdersCreateDto().First();

	private static List<OrderCreateDto> GetOrdersCreateDto() =>
	[
		new OrderCreateDto
		{
			OrderItems = [],
			Address = "123 Main St",
		},
		new OrderCreateDto
		{
			OrderItems = [],
			Address = "456 Elm St"
		}
	];

	private static OrderGetDto GetOrderGetDto() => GetOrdersGetDto().First();

	private static List<OrderGetDto> GetOrdersGetDto() =>
	[
		new OrderGetDto
		{
			Id = 1,
			AccountId = Guid.Parse("b495d8c6-46ed-470d-ba20-507cd1e4e509"),
			Status = "Pending",
			Address = "123 Main St",
			OrderTime = ConstantNow,
			OrderItems = []
		},
		new OrderGetDto
		{
			Id = 2,
			AccountId = Guid.Parse("aa6e7309-d53c-481e-b179-e13fdfaf6c47"),
			Status = "Pending",
			Address = "456 Elm St",
			OrderTime = ConstantNow,
			OrderItems = []
		}
	];

	private static void SetJwtUser(ControllerBase controller, Guid accountId)
	{
		var claims = new List<Claim>
		{
			new(nameof(JwtUser), JsonSerializer.Serialize(new JwtUser
			{
				Id = accountId,
				Issuer = "",
				Audience = "",
				Role = "customer",
				NotBefore = ConstantNow,
				IssuedAt = ConstantNow,
				ExpiresAt = ConstantNow,
			}))
		};
		var identity = new ClaimsIdentity(claims, "TestAuthType");
		var principal = new ClaimsPrincipal(identity);
		var httpContext = new DefaultHttpContext { User = principal };
		controller.ControllerContext = new ControllerContext { HttpContext = httpContext };
	}

	private static void SetJwtUser(ControllerBase controller)
	{
		SetJwtUser(controller, Guid.Parse(GetOrder().AccountId));
	}
}