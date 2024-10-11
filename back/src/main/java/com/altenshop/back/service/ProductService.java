package com.altenshop.back.service;

import com.altenshop.back.model.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProductService {
    List<Product> getAllProducts();
    Product save(Product product);
    Product getProductById(Long id);
    Product updateProduct(Product product);
    void deleteProductById(Long id);
}
