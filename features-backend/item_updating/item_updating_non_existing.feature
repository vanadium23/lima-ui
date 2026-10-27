@ts-implemented
Feature: Attempting to do an update to non-existing item

  Background:
    Given I am "user@example.com"

  Scenario: Attempting to update item without providing the id
    When I provide an update without providing item id
    # The need for these two steps is because clj-http library doesn't
    # support redirects for PATCH request. The problem is described
    # in the dedicated issue https://github.com/dakrone/clj-http/issues/641.
    Then my request is interpreted as an attempt to update /items
    Then I attempt to do the update to /items as interpreted
    Then I see the following HTTP status code: 405
    Then I see the following error: "HTTP-method-not-allowed"

  Scenario: Attempting to update item providing the incorrect id
    When I provide an update using the incorrect item id
    Then my attempt to update an item fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "item-id-incorrect"
    Then I see the incorrect item's id in the error message

  Scenario: Attempting to update a non-existing item
    When I provide an update to non-existing item
    Then my attempt to update an item fails
    Then I see the following HTTP status code: 404
    Then I see the following error: "item-not-found"
    Then I see the unavailable item's id in the error message

  Scenario: Attempting to update a non-existing item with incorrect data
    When I provide an update to non-existing item with incorrect data
    Then my attempt to update an item fails
    Then I see the following HTTP status code: 404
    Then I see the following error: "item-not-found"
    Then I see the unavailable item's id in the error message
