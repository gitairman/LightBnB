SELECT reservations.id as id, title, start_date, cost_per_night, AVG(rating) as average_rating
FROM properties
JOIN reservations ON reservations.property_id=properties.id
JOIN property_reviews on property_reviews.property_id=properties.id
WHERE reservations.guest_id = 1
GROUP BY reservations.id, properties.id
ORDER BY start_date
LIMIT 10;
