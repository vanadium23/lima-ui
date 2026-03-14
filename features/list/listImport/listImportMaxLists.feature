Feature: Importing elements when lists limit is reached

  Background:
    And I clear all data

  @heavy
  Scenario: User creates maximum lists and sees all other lists in import dialog
    When I add lists to their limit
    And I open "My Lists" page
    And I press on the "first" list stripe
    # And I wait for the page to load
    And I ensure the tools panel is open
    And I press the "tools panel import" button
    Then I expect to see the "import" dialog modal box
    Then I expect to see the "import" dialog loading
    Then I expect to see all other lists in the import dialog
