Feature: Errors and warnings during list update

  @heavy
  @broken
  Scenario: List update with items at limit and connection error shows both problems
    When I clear all data
    And I add a list
    And I refresh the page
    Given There is no internet connection
    And I ensure the tools panel is open
    And I add list items to their limit
    And I ensure the tools panel does not disturb
    And I fill all items inputs with their index
    And I type some text with length less or equal to the one of "list title" input limit
    And I press the "save" button
    And I wait for the page to load
    Then I expect to see the warning about items inputs limit reached
    Then I expect to see the "connection" error
