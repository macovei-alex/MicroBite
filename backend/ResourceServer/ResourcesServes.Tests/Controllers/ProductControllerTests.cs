using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using ResourceServer.Controllers;
using ResourceServer.Data.Models;
using ResourceServer.Data.Repositories;

namespace ResourcesServes.Tests.Controllers;

[TestClass]
public class ProductControllerTests
{
    private IProductRepository _productRepository;
    private ProductController _controller;

    [TestInitialize]
    public void Setup()
    {
        _productRepository = Substitute.For<IProductRepository>();
        _controller = new ProductController(_productRepository);
    }

    [TestMethod]
    public void GetAll_ShouldReturnOkResult_WhenProductsExist()
    {
        var products = GetProducts();
        _productRepository.GetAll().Returns(products);

        var result = _controller.GetAll().Result as OkObjectResult;

        Assert.IsNotNull(result, "Expected OkObjectResult");
    }

    [TestMethod]
    public void GetById_ShouldReturnOkResult_WhenProductExists()
    {
        var product = GetProduct();
        _productRepository.GetById(1).Returns(product);

        var result = _controller.GetById(1).Result as OkObjectResult;

        Assert.IsNotNull(result, "Expected OkObjectResult");
        Assert.AreEqual(1, (result.Value as Product)?.Id, "Expected matching Id");
    }

    [TestMethod]
    public void GetById_ShouldReturnNotFound_WhenProductDoesNotExist()
    {
        _productRepository.GetById(1).Returns((Product)null);

        var result = _controller.GetById(1).Result;

        Assert.IsInstanceOfType<NotFoundResult>(result);
    }

    [TestMethod]
    public void Create_ShouldReturnCreatedAtAction_WhenProductCreated()
    {
        var newProduct = GetProducts().First();
        var createdProduct = GetProducts()[1];
        _productRepository.Create(newProduct).Returns(createdProduct);

        var actionResult = _controller.Create(newProduct);
        var result = actionResult.Result as CreatedAtActionResult;

        Assert.IsNotNull(result, "Expected CreatedAtActionResult");
        Assert.AreEqual(createdProduct.Id, (result.Value as Product)?.Id, "Expected matching Id");
    }

    [TestMethod]
    public void Create_ShouldReturnBadRequest_WhenRepositoryThrowsArgumentException()
    {
        var newProduct = GetProduct();
        _productRepository.Create(newProduct).Returns(x => { throw new System.ArgumentException("Error"); });

        var actionResult = _controller.Create(newProduct);
        var result = actionResult.Result as BadRequestObjectResult;

        Assert.IsNotNull(result, "Expected BadRequestObjectResult");
    }

    [TestMethod]
    public void Update_ShouldReturnNoContent_WhenProductUpdated()
    {
        var productToUpdate = GetProduct();
        _productRepository.Update(1, productToUpdate).Returns(true);

        var result = _controller.Update(1, productToUpdate);

        Assert.IsInstanceOfType<NoContentResult>(result);
    }

    [TestMethod]
    public void Update_ShouldReturnNotFound_WhenProductNotUpdated()
    {
        var productToUpdate = GetProduct();
        _productRepository.Update(1, productToUpdate).Returns(false);

        var result = _controller.Update(1, productToUpdate);

        Assert.IsInstanceOfType<NotFoundResult>(result);
    }

    [TestMethod]
    public void Delete_ShouldReturnNoContent_WhenProductDeleted()
    {
        _productRepository.Delete(1).Returns(true);

        var result = _controller.Delete(1);

        Assert.IsInstanceOfType<NoContentResult>(result);
    }

    [TestMethod]
    public void Delete_ShouldReturnNotFound_WhenProductNotDeleted()
    {
        _productRepository.Delete(1).Returns(false);

        var result = _controller.Delete(1);

        Assert.IsInstanceOfType<NotFoundResult>(result);
    }

    private static Product GetProduct() => GetProducts().First();

    private static List<Product> GetProducts()
    {
        var electronicsCategory = new ProductCategory { Id = 1, Name = "Electronics" };
        var booksCategory = new ProductCategory { Id = 2, Name = "Books" };

        return
        [
            new() {
                Id = 1,
                Category = electronicsCategory,
                Name = "Smartphone",
                Price = 699.99m,
                Description = "Latest smartphone with advanced features",
                Image = "smartphone.jpg"
            },
            new() {
                Id = 2,
                Category = booksCategory,
                Name = "Science Fiction Novel",
                Price = 14.99m,
                Description = "A thrilling science fiction novel",
                Image = "scifi.jpg"
            }
        ];
    }
}