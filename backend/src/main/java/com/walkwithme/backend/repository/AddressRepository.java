package com.walkwithme.backend.repository;

import com.walkwithme.backend.model.Address;
import com.walkwithme.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@Repository
@EnableJpaRepositories
public interface AddressRepository extends JpaRepository<Address, Long> {
}
