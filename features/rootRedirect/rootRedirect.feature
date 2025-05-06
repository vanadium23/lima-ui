Feature: Root page redirects to Lists page

  Scenario: Redirect to Lists page on root navigation
    When I navigate to the root page
    Then I should be redirected to the Lists page
