@ts-implemented
Feature: Checking clear database in dev for frontend BDD Scenario

  Scenario: Expecting to have a clear lists and items route in dev
    When I make a request to clear "lists and items" using GET HTTP method
    Then I expect successful response with body: "GET doesn't clear lists and items."

  Scenario: Expecting to have a clear users route in dev
    When I make a request to clear "users" using GET HTTP method
    Then I expect successful response with body: "GET doesn't clear users."
