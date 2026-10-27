@ts-implemented
Feature: User-specific list isolation

  Users should only see their own lists and receive 404 when accessing others' resources.

  Background:
    Given I am "other@example.com"
    And I create a new list
    And I remember this list as "other's"
    And I remember the first item of this list as "other's item"
    Given I am "user@example.com"
    And I create a new list
    And I create a new list

  Scenario: Asking for my lists does not return other users' lists
    When I ask for all my lists
    Then my lists do not include other users' lists

  Scenario: Asking for my lists via HEAD does not return information about other users' lists
    When I ask for all my lists
    When I send HEAD /lists with a valid token
    Then GET and HEAD Content-Length headers match

  Scenario: Attempting to ask for another user's list returns 404
    When I ask for the "other's" list
    Then I see the following HTTP status code: 404
    Then I see the following error: "list-not-found"

  Scenario: Attempting to HEAD ask for another another user's list returns 404
    When I ask for the "other's" list via HEAD
    Then I see the following HTTP status code: 404

  Scenario: Attempting update another user's list returns 404
    When I try to update the "other's" list
    Then I see the following HTTP status code: 404
    Then I see the following error: "list-not-found"

  Scenario: Attempting to delete another user's list returns 404
    When I try to delete the "other's" list
    Then I see the following HTTP status code: 404
    Then I see the following error: "list-not-found"

  Scenario: Searching for lists does not return other users' lists
    When I want to search lists
    And I provide a query: "Some"
    Then I successfully search lists
    And search results do not include other users' lists

  Scenario: Asking for lists’ count does not count other users' lists
    When I request the current count of lists
    Then I see the following HTTP status code: 200
    And I store the initial lists count
    Given I am "other@example.com"
    And I create a new list
    Given I am "user@example.com"
    When I request the current count of lists
    Then I see the lists count increased by 0

  Scenario: Asking for lists’ count via HEAD does not return information about other users' lists
    When I request the current count of lists
    Then I see the following HTTP status code: 200
    When I send HEAD to count lists with a valid token
    Then GET and HEAD Content-Length headers match for count

  Scenario: Asking for items via HEAD does not return information about other users' items
    When I send HEAD /items with a valid token
    Then I see the following HTTP status code: 501

  Scenario: Attempting to ask for another user's item returns 404
    When I attempt to ask for the "other's item" item
    Then I see the following HTTP status code: 404
    Then I see the following error: "item-not-found"

  Scenario: Attempting to ask for another user's item via HEAD returns 404
    When I ask for the "other's item" item via HEAD
    Then I see the following HTTP status code: 404

  Scenario: Attempting to update another user's item returns 404
    When I attempt to update the "other's item" item
    Then I see the following HTTP status code: 404
    Then I see the following error: "item-not-found"
