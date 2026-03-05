Feature: Page not found

  Scenario: User navigates to non-existent page and sees 404
    When I navigate to a random non-existent page
    Then I expect to be on the "Page Not Found" page
    Then I expect to see the 404 error message
