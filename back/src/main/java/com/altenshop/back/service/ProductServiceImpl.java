package com.altenshop.back.service;

import com.altenshop.back.exception.ProductNotFoundException;
import com.altenshop.back.model.InventoryStatus;
import com.altenshop.back.model.Product;
import com.altenshop.back.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    ProductRepository productRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Override
    public Product save(Product product) {
        //validate fields that are required in the frontend
        validateRequiredProperties(product);
        product.setInventoryStatus(calculateInventoryStatus(product.getQuantity()));
        product.setCreatedAt(Instant.now().toEpochMilli());
        product.setUpdatedAt(Instant.now().toEpochMilli());
        return productRepository.save(product);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException("Product not found"));
    }

    @Override
    public Product updateProduct(Product product) {
        //check if there is a product with this id
        Product productToUpdate = productRepository.findById(product.getId()).orElseThrow(() -> new ProductNotFoundException("Product not found"));

        //validate fields that are required in the frontend
        validateRequiredProperties(product);

        //update the fields
        productToUpdate.setName(product.getName());
        productToUpdate.setCode(product.getCode());
        productToUpdate.setDescription(product.getDescription());
        productToUpdate.setPrice(product.getPrice());
        productToUpdate.setCategory(product.getCategory());
        productToUpdate.setQuantity(product.getQuantity());
        productToUpdate.setInventoryStatus(calculateInventoryStatus(product.getQuantity()));
        productToUpdate.setUpdatedAt(Instant.now().toEpochMilli());

        //save the updated product
        return productRepository.save(productToUpdate);
    }

    @Override
    public void deleteProductById(Long id) {
        productRepository.findById(id).ifPresentOrElse(productRepository::delete, () -> {throw new ProductNotFoundException("Product not found");});
    }

    private InventoryStatus calculateInventoryStatus(int quantity) {
        if (quantity == 0) {
            return InventoryStatus.OUTOFSTOCK;
        } else if (quantity < 10){
            return InventoryStatus.LOWSTOCK;
        } else {
            return InventoryStatus.INSTOCK;
        }
    }

    private static void validateRequiredProperties(Product product) {
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("The product name cannot be null");
        }
        if (product.getCode() == null || product.getCode().trim().isEmpty()) {
            throw new IllegalArgumentException("The product code cannot be null");
        }
        if (product.getPrice() == null || product.getPrice() <= 0) {
            throw new IllegalArgumentException("The product price cannot be null and must be greater than 0");
        }
        if (product.getQuantity() == null) {
            throw new IllegalArgumentException("The product quantity cannot be null");
        }
    }
}
