using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using ResourceServer.Controllers;
using ResourceServer.Data.Models;
using ResourceServer.Data.DTO;
using ResourceServer.Data.Repositories;

namespace ResourcesServes.Tests.Controllers;

[TestClass]
public class OrderItemControllerTests
{
    private IOrderItemRepository _repository;
    private OrderItemController _controller;

    [TestInitialize]
    public void Setup()
    {
        _repository = Substitute.For<IOrderItemRepository>();
        _controller = new OrderItemController(_repository);
    }

    [TestMethod]
    public void GetAll_ShouldReturnOkResult_WhenItemsExist()
    {
        var items = new List<OrderItem>
        {
            new() { Id = 1 },
            new() { Id = 2 }
        };
        _repository.GetAll().Returns(items);

        var actionResult = _controller.GetAll();
        var result = actionResult.Result as OkObjectResult;

        Assert.IsNotNull(result, "Expected OkObjectResult");
    }

    [TestMethod]
    public void GetById_ShouldReturnOkResult_WhenItemExists()
    {
        var item = new OrderItem { Id = 1 };
        _repository.GetById(1).Returns(item);

        var actionResult = _controller.GetById(1);
        var result = actionResult.Result as OkObjectResult;

        Assert.IsNotNull(result, "Expected OkObjectResult");
        Assert.AreEqual(1, (result.Value as OrderItem)?.Id, "Expected matching Id");
    }

    [TestMethod]
    public void GetById_ShouldReturnNotFound_WhenItemDoesNotExist()
    {
        _repository.GetById(1).Returns((OrderItem)null);

        var actionResult = _controller.GetById(1);

        Assert.IsInstanceOfType<NotFoundResult>(actionResult.Result);
    }

    [TestMethod]
    public void Create_ShouldReturnCreatedAtAction_WhenItemCreated()
    {
        var dto = new OrderItemDto();
        var createdDto = new OrderItemDto { Id = 1 };
        _repository.Add(dto).Returns(createdDto);

        var actionResult = _controller.Create(dto);
        var result = actionResult.Result as CreatedAtActionResult;

        Assert.IsNotNull(result, "Expected CreatedAtActionResult");
        Assert.AreEqual(createdDto.Id, (result.Value as OrderItemDto)?.Id, "Expected matching Id");
    }


    [TestMethod]
    public void Update_ShouldReturnNoContent_WhenItemUpdated()
    {
        var dto = new OrderItemDto();
        _repository.Update(1, dto).Returns(true);

        var result = _controller.Update(1, dto);

        Assert.IsInstanceOfType<NoContentResult>(result);
    }

    [TestMethod]
    public void Update_ShouldReturnNotFound_WhenItemNotUpdated()
    {
        var dto = new OrderItemDto();
        _repository.Update(1, dto).Returns(false);

        var result = _controller.Update(1, dto);

        Assert.IsInstanceOfType<NotFoundResult>(result);
    }

    [TestMethod]
    public void Delete_ShouldReturnNoContent_WhenItemDeleted()
    {
        _repository.Delete(1).Returns(true);

        var result = _controller.Delete(1);

        Assert.IsInstanceOfType<NoContentResult>(result);
    }

    [TestMethod]
    public void Delete_ShouldReturnNotFound_WhenItemNotDeleted()
    {
        _repository.Delete(1).Returns(false);

        var result = _controller.Delete(1);

        Assert.IsInstanceOfType<NotFoundResult>(result);
    }
}