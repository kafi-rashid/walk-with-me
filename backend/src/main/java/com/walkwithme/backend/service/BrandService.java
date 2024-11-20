package com.walkwithme.backend.service;

import com.walkwithme.backend.dto.BrandDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BrandService {
    BrandDTO createBrand(BrandDTO brandDTO);

    BrandDTO getBrandById(Long id);

    List<BrandDTO> getAllBrands();

    BrandDTO updateBrand(Long id, BrandDTO brandDTO);

    void deleteBrand(Long id);
}
