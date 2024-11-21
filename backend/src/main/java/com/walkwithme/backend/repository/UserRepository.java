package com.walkwithme.backend.repository;

import com.walkwithme.backend.model.UserEntity;
import com.walkwithme.backend.model.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@EnableJpaRepositories
public interface UserRepository  extends JpaRepository<UserEntity, Long> {
    @Query("SELECT u FROM UserEntity u WHERE u.email = :email")
    Optional<UserEntity> findByEmail(@Param("email") String email);
    @Query("SELECT u FROM UserEntity u WHERE u.status = :status")
    List<UserEntity> findAllPendingUser(@Param("status") UserStatus status);


    @Query("SELECT u FROM UserEntity u JOIN u.roles r WHERE r.name = :role")
    List<UserEntity> findByRoleName(@Param("role") String role);
    List<UserEntity> findByRoles_Name(String role);

}
