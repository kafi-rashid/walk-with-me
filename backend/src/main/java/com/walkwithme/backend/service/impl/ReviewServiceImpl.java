package com.walkwithme.backend.service.impl;

import com.walkwithme.backend.dto.ReviewDto;
import com.walkwithme.backend.model.Review;
import com.walkwithme.backend.repository.ReviewRepository;
import com.walkwithme.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public ReviewDto createReview(ReviewDto reviewDto) {
        try {
            Review review = mapToEntity(reviewDto);
            review.setReviewDate(LocalDateTime.now());
            Review savedReview = reviewRepository.save(review);
            return mapToDto(savedReview);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error creating review: " + e.getMessage());
        }
    }

    @Override
    public ReviewDto getReviewById(Long id) {
        return reviewRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with id: " + id));
    }

    @Override
    public List<ReviewDto> getAllReviews() {
        try {
            return reviewRepository.findAll().stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new IllegalArgumentException(" Piku Error retrieving all reviews: " + e.getMessage());
        }
    }

    @Override
    public ReviewDto updateReview(Long id, ReviewDto reviewDto) {
        try {
            Review review = reviewRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Review not found with id: " + id));
            review.setComment(reviewDto.getComment());
            review.setRating(reviewDto.getRating());
            Review updatedReview = reviewRepository.save(review);
            return mapToDto(updatedReview);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error updating review: " + e.getMessage());
        }
    }

    @Override
    public void deleteReview(Long id) {
        try {
            Review review = reviewRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Review not found with id: " + id));
            reviewRepository.delete(review);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error deleting review: " + e.getMessage());
        }
    }

    private ReviewDto mapToDto(Review review) {
        return ReviewDto.builder()
                .id(review.getId())
                .comment(review.getComment())
                .rating(review.getRating())
                .productName(review.getProduct().getName())
                .buyerFistName(review.getBuyer().getFirstName())
                .buyerLastName(review.getBuyer().getLastName())
                .reviewDate(review.getReviewDate())
                .build();
    }

    private Review mapToEntity(ReviewDto reviewDto) {
        Review review = new Review();
        review.setComment(reviewDto.getComment());
        review.setRating(reviewDto.getRating());
//        review.setBuyer();
        // Note: Mapping buyer and product entities should use respective services or repositories
        return review;
    }
}
