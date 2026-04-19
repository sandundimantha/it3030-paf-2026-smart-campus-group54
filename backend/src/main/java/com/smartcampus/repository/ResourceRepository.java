package com.smartcampus.repository;

import com.smartcampus.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    @Query("SELECT r FROM Resource r WHERE " +
           "(:type IS NULL OR :type = '' OR r.type = :type) AND " +
           "(:location IS NULL OR :location = '' OR r.location = :location) AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:minCapacity IS NULL OR r.capacity >= :minCapacity) AND " +
           "(:maxCapacity IS NULL OR r.capacity <= :maxCapacity)")
    List<Resource> findWithFilters(@Param("type") String type, 
                                   @Param("location") String location, 
                                   @Param("status") Resource.ResourceStatus status,
                                   @Param("minCapacity") Integer minCapacity,
                                   @Param("maxCapacity") Integer maxCapacity);
}
