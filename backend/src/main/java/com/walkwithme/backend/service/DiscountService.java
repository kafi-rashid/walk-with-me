package com.walkwithme.backend.service;

import com.walkwithme.backend.dto.DiscountDTO;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface DiscountService {

    DiscountDTO createDiscount(DiscountDTO discountDTO);

    DiscountDTO getDiscountById(Long id);

    List<DiscountDTO> getAllDiscounts();

    DiscountDTO updateDiscount(Long id, DiscountDTO discountDTO);

    void deleteDiscount(Long id);
}
