package com.altenshop.back.controller;

import com.altenshop.back.exception.ProductNotFoundException;
import com.altenshop.back.model.Product;
import com.altenshop.back.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/products")
public class ProductController {
    //TODO: Add logs on the different actions
    //TODO: Add rating field to create and update

    @Autowired
    ProductService productService;

    private static final Logger log = LoggerFactory.getLogger(ProductController.class);

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product savedProduct = productService.save(product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return new ResponseEntity<>(productService.getProductById(id), HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            log.warn("Updated product with id: {}", id);
            return new ResponseEntity<>(productService.updateProduct(product), HttpStatus.OK);
        } catch (ProductNotFoundException e) {
            log.warn("No product with id: {} was found ! Update aborted", id);
            return ResponseEntity.notFound().build();

        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProductById(id);
            log.warn("Deleted product with id: {}", id);
            return ResponseEntity.noContent().build();
        } catch (ProductNotFoundException e) {
            log.warn("No product with id: {} was found ! Delete aborted", id);
            return ResponseEntity.notFound().build();

        }
    }
}
