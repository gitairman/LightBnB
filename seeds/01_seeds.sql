INSERT INTO users (name, email, password)
VALUES ('Aaron Hopkins', 'aaron@hopkins.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Sophie Hopkins', 'sophie@hopkins.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Thomas Hopkins', 'thomas@hopkins.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'the house', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 100, 10, 5, 5, 'Canada', 'Mount Fee', 'Whistler', 'bc', 'V8E1P7', true), 
(2, 'the palace', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 1000, 50, 5, 5, 'Canada', 'Mount Fee', 'Whistler', 'bc', 'V8E1P7', true), 
(3, 'the litterbox', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 10, 10, 5, 5, 'Canada', 'Mount Fee', 'Whistler', 'bc', 'V8E1P7', true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 1, 3), ('2019-09-11', '2019-09-26', 2, 1), ('2020-09-11', '2021-09-26', 3, 2);

INSERT INTO property_reviews (rating, message, guest_id, property_id, reservation_id)
VALUES (5, 'message', 3, 1, 1), (4, 'message', 1, 2, 2), (3, 'message', 2, 3, 3);