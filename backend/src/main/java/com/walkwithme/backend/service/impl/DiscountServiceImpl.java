package com.walkwithme.backend.service.impl;

import com.walkwithme.backend.dto.DiscountDTO;
import com.walkwithme.backend.model.Discount;
import com.walkwithme.backend.repository.DiscountRepository;
import com.walkwithme.backend.service.DiscountService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiscountServiceImpl implements DiscountService {

    private final DiscountRepository discountRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public DiscountDTO createDiscount(DiscountDTO discountDTO) {
        Discount discount = modelMapper.map(discountDTO, Discount.class);
        Discount savedDiscount = discountRepository.save(discount);
        return mapToDTO(savedDiscount);
    }

    @Override
    public DiscountDTO getDiscountById(Long id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discount not found with id: " + id));
        return mapToDTO(discount);
    }

    @Override
    public List<DiscountDTO> getAllDiscounts() {
        return discountRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DiscountDTO updateDiscount(Long id, DiscountDTO discountDTO) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discount not found with id: " + id));

        discount.setName(discountDTO.getName());
        discount.setPercentage(discountDTO.getPercentage());
        discount.setStartDate(discountDTO.getStartDate());
        discount.setEndDate(discountDTO.getEndDate());

        Discount updatedDiscount = discountRepository.save(discount);
        return mapToDTO(updatedDiscount);
    }

    @Override
    public void deleteDiscount(Long id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discount not found with id: " + id));
        discountRepository.delete(discount);
    }

    private DiscountDTO mapToDTO(Discount discount) {
        return DiscountDTO.builder()
                .id(discount.getId())
                .name(discount.getName())
                .percentage(discount.getPercentage())
                .startDate(discount.getStartDate())
                .endDate(discount.getEndDate())
                .build();
    }
}
