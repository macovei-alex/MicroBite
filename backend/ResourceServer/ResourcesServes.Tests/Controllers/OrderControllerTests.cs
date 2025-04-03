﻿using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using ResourceServer.Controllers;
using ResourceServer.Data.Models;
using ResourceServer.Data.Repositories;

namespace ResourcesServes.Tests.Controllers;

[TestClass]
public class OrderControllerTests
{
    private IOrderRepository _repository;
    private OrderController _controller;

    [TestInitialize]
    public void Setup()
    {
        _repository = Substitute.For<IOrderRepository>();
        _controller = new OrderController(_repository);
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
    public void Create_ShouldReturnCreatedAtActionResult_WhenOrderCreated()
    {
        var newOrder = GetOrder();
        var createdOrder = GetOrder();
        _repository.Add(newOrder).Returns(createdOrder);

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
            AccountId = "acc1",
            Address = "123 Main St",
            OrderTime = DateTime.UtcNow
        },
        new Order
        {
            Id = 2,
            Status = new OrderStatus
            {
                Id = 1,
                Name = "Pending"
            },
            AccountId = "acc2",
            Address = "456 Elm St",
            OrderTime = DateTime.UtcNow
        }
    ];

    [TestMethod]
    public void test()
    {
        Assert.IsTrue(false);
    }
}