using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using ResourceServer.Controllers;
using ResourceServer.Data.Models;
using ResourceServer.Data.Repositories;

namespace ResourcesServes.Tests.Controllers;

[TestClass]
public class ProductCategoryControllerTests
{
    private IProductCategoryRepository _repository;
    private ProductCategoryController _controller;

    [TestInitialize]
    public void Setup()
    {
        _repository = Substitute.For<IProductCategoryRepository>();
        _controller = new ProductCategoryController(_repository);
    }

    [TestMethod]
    public void GetAll_ShouldReturnsOkResult_WhenRepositoryRetunrListOfCategories()
    {
        var categories = new List<ProductCategory>
        {
            new() { Id = 1, Name = "Category1" },
            new() { Id = 2, Name = "Category2" }
        };
        _repository.GetAll().Returns(categories);

        var actionResult = _controller.GetAll();

        var okResult = actionResult.Result as OkObjectResult;
        Assert.IsNotNull(okResult, "Expected an OkObjectResult");
        var returnedCategories = okResult.Value as IEnumerable<ProductCategory>;
        Assert.IsNotNull(returnedCategories, "Expected a list of ProductCategory");
        CollectionAssert.AreEqual(new List<ProductCategory>(categories), new List<ProductCategory>(returnedCategories));
    }

    [TestMethod]
    public void GetById_ShouldReturnOkResult_WhenCategoryExists()
    {
        var category = new ProductCategory { Id = 1, Name = "Category1" };
        _repository.GetById(1).Returns(category);

        var actionResult = _controller.GetById(1);

        var okResult = actionResult.Result as OkObjectResult;
        Assert.IsNotNull(okResult, "Expected an OkObjectResult");
        var returnedCategory = okResult.Value as ProductCategory;
        Assert.IsNotNull(returnedCategory, "Expected a ProductCategory");
        Assert.AreEqual(category.Id, returnedCategory.Id, "Category Id should match");
    }

    [TestMethod]
    public void GetById_ShouldReturnNotFound_WhenCategoryDoesNotExist()
    {
        _repository.GetById(1).Returns((ProductCategory)null);

        var actionResult = _controller.GetById(1);

        Assert.IsInstanceOfType<NotFoundResult>(actionResult.Result, "Expected a NotFoundResult");
    }

    [TestMethod]
    public void Create_ShouldReturnCreatedAtActionResult_WhenCategoryCreated()
    {
        var newCategory = new ProductCategory { Name = "New Category" };
        var createdCategory = new ProductCategory { Id = 1, Name = "New Category" };
        _repository.Add(newCategory).Returns(createdCategory);

        var actionResult = _controller.Create(newCategory);

        var createdAtResult = actionResult.Result as CreatedAtActionResult;
        Assert.IsNotNull(createdAtResult, "Expected a CreatedAtActionResult");
        Assert.AreEqual(nameof(_controller.GetById), createdAtResult.ActionName, "Expected action name to be GetById");
        var returnedCategory = createdAtResult.Value as ProductCategory;
        Assert.IsNotNull(returnedCategory, "Expected a ProductCategory");
        Assert.AreEqual(createdCategory.Id, returnedCategory.Id, "Created category Id should match");
    }

    [TestMethod]
    public void Update_ShouldReturnNoContent_WhenCategoryExists()
    {
        var categoryToUpdate = new ProductCategory { Id = 1, Name = "Updated Category" };
        _repository.Update(1, categoryToUpdate).Returns(true);

        var result = _controller.Update(1, categoryToUpdate);

        Assert.IsInstanceOfType<NoContentResult>(result, "Expected a NoContentResult");
    }

    [TestMethod]
    public void Update_ShouldReturnNotFound_WhenCategoryDoesNotExist()
    {
        var categoryToUpdate = new ProductCategory { Id = 1, Name = "Updated Category" };
        _repository.Update(1, categoryToUpdate).Returns(false);

        var result = _controller.Update(1, categoryToUpdate);

        Assert.IsInstanceOfType<NotFoundResult>(result, "Expected a NotFoundResult");
    }

    [TestMethod]
    public void Delete_ShouldReturnNoContent_WhenCategoryExists()
    {
        _repository.Delete(1).Returns(true);

        var result = _controller.Delete(1);

        Assert.IsInstanceOfType<NoContentResult>(result, "Expected a NoContentResult");
    }

    [TestMethod]
    public void Delete_ShouldReturnNotFound_WhenCategoryDoesNotExist()
    {
        _repository.Delete(1).Returns(false);

        var result = _controller.Delete(1);

        Assert.IsInstanceOfType<NotFoundResult>(result, "Expected a NotFoundResult");
    }
}