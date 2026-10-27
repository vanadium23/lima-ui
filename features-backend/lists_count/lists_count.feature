@ts-implemented
Feature: Get the count of lists

  Background:
    Given I am "user@example.com"

  Scenario: Successfully getting the count of lists
    When I request the current count of lists
    Then I see the following HTTP status code: 200

  Scenario: Count increases after creating new lists
    When I request the current count of lists
    Then I see the following HTTP status code: 200
    And I store the initial lists count
    When I create the following number of lists: 25
    And I request the current count of lists
    And I see the lists count increased by 25

