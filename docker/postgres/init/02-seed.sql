DO $$ 
DECLARE
    cafe_latte_id UUID;
    bean_scene_id UUID;
    coffee_tales_id UUID;
    urban_brew_id UUID;
    daily_grind_id UUID;
    cafe_harvest_id UUID;
BEGIN
    -- Insert cafes and store their IDs
    INSERT INTO cafes (name, description, location) 
    VALUES ('Cafe Latte', 'A cozy cafe in the heart of downtown serving artisanal coffee', 'Downtown')
    RETURNING id INTO cafe_latte_id;

    INSERT INTO cafes (name, description, location) 
    VALUES ('Bean Scene', 'Modern cafe with great ambiance and specialty brews', 'Orchard')
    RETURNING id INTO bean_scene_id;

    INSERT INTO cafes (name, description, location) 
    VALUES ('Coffee Tales', 'Artisanal coffee and freshly baked pastries', 'Marina Bay')
    RETURNING id INTO coffee_tales_id;

    INSERT INTO cafes (name, description, location) 
    VALUES ('Urban Brew', 'Contemporary coffee shop with industrial design', 'Bugis')
    RETURNING id INTO urban_brew_id;

    INSERT INTO cafes (name, description, location) 
    VALUES ('Daily Grind', 'Quick service cafe perfect for busy professionals', 'CBD')
    RETURNING id INTO daily_grind_id;

    INSERT INTO cafes (name, description, location) 
    VALUES ('Cafe Harvest', 'Farm-to-table concept cafe with organic coffee', 'Holland Village')
    RETURNING id INTO cafe_harvest_id;

    -- Insert employees with varying start dates
    INSERT INTO employees (id, name, email_address, phone_number, gender, cafe_id, start_date) 
    VALUES 
    -- Cafe Latte employees
    ('UI' || substring(md5(random()::text), 1, 7), 'John Doe', 'john.doe@email.com', '91234567', 'Male', cafe_latte_id, '2023-12-01'),
    ('UI' || substring(md5(random()::text), 1, 7), 'Sarah Lee', 'sarah.lee@email.com', '82345678', 'Female', cafe_latte_id, '2024-01-15'),
    ('UI' || substring(md5(random()::text), 1, 7), 'Alex Wong', 'alex.w@email.com', '93456789', 'Male', cafe_latte_id, '2024-02-01'),
    
    -- Bean Scene employees
    ('UI' || substring(md5(random()::text), 1, 7), 'Emma Chen', 'emma.chen@email.com', '84567890', 'Female', bean_scene_id, '2023-11-15'),
    ('UI' || substring(md5(random()::text), 1, 7), 'Michael Tan', 'michael.t@email.com', '95678901', 'Male', bean_scene_id, '2024-01-10'),
    ('UI' || substring(md5(random()::text), 1, 7), 'Rachel Lim', 'rachel.l@email.com', '86789012', 'Female', bean_scene_id, '2024-02-15'),
    
    -- Coffee Tales employees
    ('UI' || substring(md5(random()::text), 1, 7), 'David Zhang', 'david.z@email.com', '97890123', 'Male', coffee_tales_id, '2023-10-01'),
    ('UI' || substring(md5(random()::text), 1, 7), 'Lisa Wang', 'lisa.w@email.com', '88901234', 'Female', coffee_tales_id, '2024-01-20'),
    ('UI' || substring(md5(random()::text), 1, 7), 'Kevin Ng', 'kevin.ng@email.com', '99012345', 'Male', coffee_tales_id, '2024-02-10'),
    
    -- Urban Brew employees
    ('UI' || substring(md5(random()::text), 1, 7), 'Jessica Teo', 'jessica.t@email.com', '89123456', 'Female', urban_brew_id, '2023-09-15'),
    ('UI' || substring(md5(random()::text), 1, 7), 'Brandon Loh', 'brandon.l@email.com', '90123456', 'Male', urban_brew_id, '2024-01-05'),
    
    -- Daily Grind employees
    ('UI' || substring(md5(random()::text), 1, 7), 'Michelle Goh', 'michelle.g@email.com', '81234567', 'Female', daily_grind_id, '2023-11-01'),
    ('UI' || substring(md5(random()::text), 1, 7), 'Ryan Koh', 'ryan.k@email.com', '92345678', 'Male', daily_grind_id, '2024-01-25'),
    ('UI' || substring(md5(random()::text), 1, 7), 'Sophia Lin', 'sophia.l@email.com', '83456789', 'Female', daily_grind_id, '2024-02-20'),
    
    -- Cafe Harvest employees
    ('UI' || substring(md5(random()::text), 1, 7), 'William Sim', 'william.s@email.com', '94567890', 'Male', cafe_harvest_id, '2023-12-15'),
    ('UI' || substring(md5(random()::text), 1, 7), 'Grace Tan', 'grace.t@email.com', '85678901', 'Female', cafe_harvest_id, '2024-01-30');

EXCEPTION WHEN others THEN
    RAISE NOTICE 'Error while inserting data: %', SQLERRM;
END $$;