# Gulp

<p>Gulp is a soft clone of Yelp.  Gulp allows users to create businesses, review the businesses of other users, reply as a business owner to user reviews of your business and favorite individual businesses.</p>

<p>
Check out <a href="https://gulp-app.onrender.com">Gulp</a>
<br>
Contact me on <a href="https://www.linkedin.com/in/roman-barbalat-00140a63/">LinkedIn</a>
</p>

## Technologies Used

![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
[![Render](https://img.shields.io/badge/render-%23430098.svg?style=for-the-badge&logo=render&logoColor=white)](https://render.com)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Amazon AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-%23FFCA28.svg?style=for-the-badge&logo=SQLAlchemy&logoColor=white)
![WTForms](https://img.shields.io/badge/WTForms-%23F7981D.svg?style=for-the-badge&logo=WTForms&logoColor=white)
![Werkzeug](https://img.shields.io/badge/Werkzeug-%23000000.svg?style=for-the-badge&logo=Werkzeug&logoColor=white)


## Landing Page

![Screenshot of the top of Gulp's Landing Page](https://bucket-rb22.s3.us-east-2.amazonaws.com/gulp_landing_top_adj.png)
![Screenshot of the bottom of Gulp's Landing Page](https://bucket-rb22.s3.us-east-2.amazonaws.com/gulp_landing_bottom.png)

## List of Businesses (portion)
![Screenshot of the bottom of Gulp's Landing Page](https://bucket-rb22.s3.us-east-2.amazonaws.com/gulp_all.png)

## Individual Business Page (top)
![Screenshot of the bottom of Gulp's Landing Page](https://bucket-rb22.s3.us-east-2.amazonaws.com/gulp_bus_top.png)

## Individual Business Page (reviews and replies)
![Screenshot of the bottom of Gulp's Landing Page](https://bucket-rb22.s3.us-east-2.amazonaws.com/gulp_review_reply.png)

## User Profile
![Screenshot of the bottom of Gulp's Landing Page](https://bucket-rb22.s3.us-east-2.amazonaws.com/gulp_user_profile.png)

## Features

### Businesses

* Users can create businesses.
* Users can view all of the businesses on the site with multiple sort options.
* Users can update their business.
* Users can delete their business.

### Reviews

* Users can review businesses.
* Users can view all of the reviews of a business with multiple sort options.
* Users can update their reviews.
* Users can delete their reviews.

### Replies

* Business owners can reply to individual reviews.
* Users can view the replies of business owners.
* Business owners can update their replies.
* Business owners an delete their replies.

### Favorites

* Users can favorite individual businesses.
* Users can their favorites on their user profiles and on the individual pages of favorites.
* Users can unfavorite businesses that they have favorited.

### AWS

* All images are submitted as files and those files are stored in an S3 bucket.

### Search and Filter

* Users can search for businesses by name.
* Users can filter businesses by tag(s) by searching for particular tags(s).

## API

### Businesses

* `GET /api/businesses/` (optional query)

  * Returns a list of all the individual business dictionaries on the site.

    ```
    [
      {
        id: integer,
        name: string,
        description: string,
        tag_one: string,
        tag_two: string,
        tag_three: string,
        address: string,
        city: string,
        state, string
        owner_id: integer,
        preview_image: string,
        created_at: string,
        updated_at: string,
        images: [ {} ],
        owner: {},
        average: integer,
        numReviews: integer
      }
    ]
    ```

* `GET /api/businesses/recent/:count`

  * Returns a list of the most recently added individual business dictionaries to the site with the route parameter specifying the count.

    ```
    [
      {
        id: integer,
        name: string,
        description: string,
        tag_one: string,
        tag_two: string,
        tag_three: string,
        address: string,
        city: string,
        state, string
        owner_id: integer,
        preview_image: string,
        created_at: string,
        updated_at: string,
        images: [ {} ],
        owner: {},
        average: integer,
        numReviews: integer
      }
    ]
      ```

* `GET /api/businesses/current`

  * Returns a list of individual business dictionaries which are owned by the logged in user.

    ```
    [
      {
        id: integer,
        name: string,
        description: string,
        tag_one: string,
        tag_two: string,
        tag_three: string,
        address: string,
        city: string,
        state, string
        owner_id: integer,
        preview_image: string,
        created_at: string,
        updated_at: string,
        images: [ {} ],
        owner: {},
        average: integer,
        numReviews: integer
      }
    ]
      ```

* `GET /api/businesses/:id`

  * Returns a dictionary of the businesses with the specified id.

    ```
    {
      id: integer,
      name: string,
      description: string,
      address: string,
      city: string,
      state: string,
      owner_id: integer,
      preview_image: string,
      average: integer,
      numReviews: integer,
      tag_one: string,
      tag_two: string,
      tag_three: string,
      created_at: string,
      updated_at: string,
      owner: {},
      images: [ {} ],
      reviewers: [],
      reviews: [ {} ]
    }
    ```

* `DELETE /api/businesses/:id`

  * Deletes the business with the specified id if it exists and returns a dictionary confirming the deletion.

    ```
    {
      message: "Successfully deleted the business"
    }
    ```

* `POST /api/businesses/`

  * Creates a new business and returns a dictionary of the new business.

    ```
    {
      id: integer,
      name: string,
      description: string,
      address: string,
      city: string,
      state: string,
      owner_id: integer,
      preview_image: string,
      average: integer,
      numReviews: integer,
      tag_one: string,
      tag_two: string,
      tag_three: string,
      created_at: string,
      updated_at: string,
      owner: {},
      images: [ {} ],
      reviews: []
    }
    ```

* `PUT /api/businesses/:id`

  * Edits an existing business and returns a dictionary of the updated business.

    ```
    {
      id: integer,
      name: string,
      description: string,
      address: string,
      city: string,
      state: string,
      preview_image: string,
      tag_one: string,
      tag_two: string,
      tag_three: string,
      created_at: string,
      updated_at: string,
      owner: {},
      images: [ {} ],
    }
    ```

* `DELETE /api/businesses/images/:id`

  * Deletes the optional business image with the specified id if it exists and returns a dictionary confirming the deletion.

    ```
    {
      message: "Successfully deleted the business image"
    }
    ```

### Reviews

* `GET /api/reviews/current`

  * Returns a list of individual review dictionaries associated with the logged in user.

    ```
    [
      {
        id: integer,
        review: string,
        rating: integer,
        reviewer_id: integer,
        business_id: string
        created_at: string,
        updated_at: string,
        business: {},
        images: [],
        reviewer: {}
      }
    ]
      ```

* `GET /api/reviews/:reviewId`

  * Returns a dictionary of the specified review.

    ```
    {
      id: integer,
      review: string,
      rating: integer,
      reviewer_id: integer,
      business_id: string
      created_at: string,
      updated_at: string,
      business: {},
      images: [],
      reviewer: {}
    }
      ```

* `POST /api/businesses/:businessId/reviews`

  * Creates a new review for the specified business and returns a dictionary of the new review.

    ```
    {
      id: integer,
      review: string,
      rating: integer,
      reviewer_id: integer,
      business_id: string
      created_at: string,
      updated_at: string,
      images: [],
      reviewer: {}
    }
    ```

* `PUT /api/reviews/:reviewId`

  * Edits a specified review and returns a dictionary of the review.

    ```
    {
      id: integer,
      review: string,
      rating: integer,
      reviewer_id: integer,
      business_id: string
      created_at: string,
      updated_at: string,
      images: []
    }
    ```

* `DELETE /api/reviews/:id`

  * Deletes the review with the specified id if it exists and returns a dictionary confirming the deletion.

    ```
    {
      message: "Successfully deleted the review"
    }
    ```

* `DELETE /api/reviews/images/:id`

  * Deletes the optional review image with the specified id if it exists and returns a dictionary confirming the deletion.

    ```
    {
      message: "Successfully deleted the review image"
    }
    ```

### Replies

* `POST /api/reviews/:reviewId/replies`

  * Creates a new reply for the specified business and returns a dictionary of the new reply.

    ```
    {
      id: integer,
      reply: string
      review_id: intger,
      created_at: string,
      updated_at: string
    }
    ```

* `PUT /api/replies/:replyId`

  * Edits a specified reply and returns a dictionary of the reply.

    ```
    {
      id: integer,
      reply: string,
      review_id: integer,
      created_at: string,
      updated_at: string
    }
    ```

* `DELETE /api/replies/:id`

  * Deletes the reply with the specified id if it exists and returns a dictionary confirming the deletion.

    ```
    {
      message: "Successfully deleted the reply"
    }
    ```

### Favorites

* `GET /api/businesses/current/favorites`

  * Returns a list of individual business dictionaries which are favorites of the logged in the user.

    ```
    [
      {
        id: integer,
        name: string,
        description: string,
        tag_one: string,
        tag_two: string,
        tag_three: string,
        address: string,
        city: string,
        state, string
        owner_id: integer,
        preview_image: string,
        created_at: string,
        updated_at: string,
        images: [ {} ],
        owner: {},
        average: integer,
        numReviews: integer
      }
    ]
      ```

* `POST /api/businesses/:businessId/favorites`

  * Creates a new favorite between the specified business and the logged in user and returns a dictionary of the new favorite.

    ```
    {
      id: integer,
      user_id: integer,
      business_id: string,
      super: boolean
      created_at: string,
      updated_at: string
    }
    ```

* `DELETE /api/favorites/:favoriteId`

  * Deletes the favorite with the specified id if it exists and returns a dictionary confirming the deletion.

    ```
    {
      message: "Successfully deleted the reply"
    }
    ```
