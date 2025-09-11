-- Query 1: Insert a new account
INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'IamIronM@n');


-- Query 2: Update the account type of the newly created account to 'Admin'
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;


-- Query 3: Delete the newly created account
DELETE FROM public.account
WHERE account_id = 1;


-- Query 4: Update the inv_description of a specific vehicle in the inventory table
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';


-- Query 5: Retrieve all vehicles from the inventory table that belong to the 'Sport' classification
SELECT inv_make, inv_model, classification_name
FROM public.inventory i
INNER JOIN public.classification c  
	ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';


-- Query 6: Update the inv_image and inv_thumbnail paths for all vehicles in the inventory table
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');