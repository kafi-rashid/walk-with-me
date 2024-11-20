package com.walkwithme.backend.service.impl;

import com.walkwithme.backend.dto.BrandDTO;
import com.walkwithme.backend.model.Brand;
import com.walkwithme.backend.repository.BrandRepository;
import com.walkwithme.backend.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandServiceImpl implements BrandService {
    @Autowired
    private  BrandRepository brandRepository;

    @Override
    public BrandDTO createBrand(BrandDTO brandDTO) {
        try {
            Brand brand = new Brand();
            brand.setName(brandDTO.getName());
            Brand savedBrand = brandRepository.save(brand);
            return mapToDTO(savedBrand);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error creating brand: " + e.getMessage());
        }
    }

    @Override
    public BrandDTO getBrandById(Long id) {
        return brandRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new IllegalArgumentException("Brand not found with id: " + id));
    }

    @Override
    public List<BrandDTO> getAllBrands() {
        try {
            return brandRepository.findAll().stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new IllegalArgumentException("Error retrieving all brands: " + e.getMessage());
        }
    }

    @Override
    public BrandDTO updateBrand(Long id, BrandDTO brandDTO) {
        try {
            Brand brand = brandRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Brand not found with id: " + id));
            brand.setName(brandDTO.getName());
            Brand updatedBrand = brandRepository.save(brand);
            return mapToDTO(updatedBrand);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error updating brand: " + e.getMessage());
        }
    }

    @Override
    public void deleteBrand(Long id) {
        try {
            Brand brand = brandRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Brand not found with id: " + id));
            brandRepository.delete(brand);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error deleting brand: " + e.getMessage());
        }
    }

    private BrandDTO mapToDTO(Brand brand) {
        return BrandDTO.builder()
                .id(brand.getId())
                .name(brand.getName())
                .build();
    }
}
