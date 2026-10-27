@ts-implemented
Feature: Attempting to delete the non-existing svernik

  Scenario: Attempting to delete svernik without providing the id
    Given I am "user@example.com"
    When I try to delete svernik without providing the id
    Then my request is interpreted as an attempt to delete /lists
    Then I see the following HTTP status code: 405
    Then I see the following error: "HTTP-method-not-allowed"

  Scenario: Attempting to delete a list while providing the incorrect id
    Given I am "user@example.com"
    When I try to delete a list using the incorrect id
    Then my attempt to delete a list fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "list-id-incorrect"
    Then I see the incorrect svernik's id in the error message

  Scenario: Attempting to delete a non-existing svernik
    Given I am "user@example.com"
    When I try to delete a non-existing svernik
    Then my attempt to delete a list fails
    Then I see the following HTTP status code: 404
    Then I see the following error: "list-not-found"
    Then I see the unavailable svernik's id in the error message
