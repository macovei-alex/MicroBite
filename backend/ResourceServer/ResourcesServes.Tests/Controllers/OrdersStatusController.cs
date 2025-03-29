using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using ResourceServer.Controllers;
using ResourceServer.Data.Models;
using ResourceServer.Data.Repositories;

namespace ResourcesServes.Tests.Controllers;

[TestClass]
public class OrdersStatusController
{
    private IOrderStatusRepository _repository;
    private OrderStatusController _controller;

    [TestInitialize]
    public void Setup()
    {
        _repository = Substitute.For<IOrderStatusRepository>();
        _controller = new OrderStatusController(_repository);
    }

    [TestMethod]
    public void GetAll_ShouldReturnOkResult_WhenRepositoryReturnsList()
    {
        var statuses = new List<OrderStatus>
        {
            new() { Id = 1, Name = "Pending" },
            new() { Id = 2, Name = "Completed" }
        };
        _repository.GetAll().Returns(statuses);
        var actionResult = _controller.GetAll();
        var result = actionResult.Result as OkObjectResult;
        Assert.IsNotNull(result);
    }

    [TestMethod]
    public void GetById_ShouldReturnOkResult_WhenStatusExists()
    {
        var status = new OrderStatus { Id = 1, Name = "Pending" };
        _repository.GetById(1).Returns(status);
        var actionResult = _controller.GetById(1);
        var result = actionResult.Result as OkObjectResult;
        Assert.IsNotNull(result);
        Assert.AreEqual(status.Id, (result.Value as OrderStatus)?.Id);
    }

    [TestMethod]
    public void GetById_ShouldReturnNotFound_WhenStatusDoesNotExist()
    {
        _repository.GetById(1).Returns((OrderStatus)null);

        var actionResult = _controller.GetById(1);

        Assert.IsInstanceOfType<NotFoundResult>(actionResult.Result);
    }

    [TestMethod]
    public void Create_ShouldReturnCreatedAtAction_WhenStatusCreated()
    {
        var status = new OrderStatus { Id = 1, Name = "Pending" };
        var createdStatus = new OrderStatus { Id = 1, Name = "Pending" };
        _repository.Add(status).Returns(createdStatus);

        var actionResult = _controller.Create(status);

        var result = actionResult.Result as CreatedAtActionResult;
        Assert.IsNotNull(result);
        Assert.AreEqual(createdStatus.Id, (result.Value as OrderStatus)?.Id);
    }

    [TestMethod]
    public void Update_ShouldReturnNoContent_WhenStatusUpdated()
    {
        var status = new OrderStatus { Id = 1, Name = "Pending" };
        _repository.Update(1, status).Returns(true);

        var result = _controller.Update(1, status);

        Assert.IsInstanceOfType(result, typeof(NoContentResult));
    }

    [TestMethod]
    public void Update_ShouldReturnNotFound_WhenStatusNotUpdated()
    {
        var status = new OrderStatus { Id = 1, Name = "Pending" };
        _repository.Update(1, status).Returns(false);

        var result = _controller.Update(1, status);

        Assert.IsInstanceOfType(result, typeof(NotFoundResult));
    }

    [TestMethod]
    public void Delete_ShouldReturnNoContent_WhenStatusDeleted()
    {
        _repository.Delete(1).Returns(true);

        var result = _controller.Delete(1);

        Assert.IsInstanceOfType(result, typeof(NoContentResult));
    }

    [TestMethod]
    public void Delete_ShouldReturnNotFound_WhenStatusNotDeleted()
    {
        _repository.Delete(1).Returns(false);

        var result = _controller.Delete(1);

        Assert.IsInstanceOfType(result, typeof(NotFoundResult));
    }
}