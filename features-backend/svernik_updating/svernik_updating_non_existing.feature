
@ts-implemented
Feature: Attempting to do an update to non-existing svernik

  Background:
    Given I am "user@example.com"

  Scenario: Attempting to update svernik without providing the id
    When I provide an update without providing svernik id
    # The need for these two steps is because clj-http library doesn't
    # support redirects for PATCH request. The problem is described
    # in the dedicated issue https://github.com/dakrone/clj-http/issues/641.
    Then my request is interpreted as an attempt to update /lists
    Then I attempt to do the update to /lists as interpreted
    Then I see the following HTTP status code: 405
    Then I see the following error: "HTTP-method-not-allowed"

  Scenario: Attempting to update svernik providing the incorrect id
    When I provide an update using the incorrect svernik id
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "list-id-incorrect"
    Then I see the incorrect svernik's id in the error message

  Scenario: Attempting to update a non-existing svernik
    When I provide an update to non-existing svernik
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 404
    Then I see the following error: "list-not-found"
    Then I see the unavailable svernik's id in the error message
