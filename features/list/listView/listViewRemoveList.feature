Feature: Removing a list from the List view page

  Background:
    When I clear all data

  Scenario: Closing a dialog modal box on pressing the cancel button while viewing a list
    When I add a list
    And I ensure the tools panel is open
    And I press the "remove list tools panel" button
    And I press the visible "cancel list removal" button
    Then I expect not to see the "remove list" dialog modal box

  Scenario: Closing a dialog modal box on pressing outside of it
    When I add a list
    And I ensure the tools panel is open
    And I press the "remove list tools panel" button
    And I click outside of the "remove list" dialog modal box
    Then I expect not to see the "remove list" dialog modal box

  Scenario: Not seeing the dialog modal box when removal in progress
    When I add a list
    And I ensure the tools panel is open
    And I press the "remove list tools panel" button
    And I press the visible "confirm list removal" button
    And I forcefully press the "remove list tools panel" button
    Then I expect not to see the "remove list" dialog modal box

  Scenario: Confirming list removal leads to redirecting to Lists page
    When I add a list
    And I ensure the tools panel is open
    And I press the "remove list tools panel" button
    And I start waiting for the "list removal" request to happen
    And I press the visible "confirm list removal" button
    And I wait for the "list removal" request to happen
    Then I expect to be on the "My Lists" page
    Then I expect to see the following number of list stripes: 0
    Then I expect to see the message about lists absence

  Scenario: Unsuccessful list removal leads to error message appearance while viewing a list
    When I add a list
    And I ensure the tools panel is open
    And I press the "remove list tools panel" button
    Given Data server is not available
    And I press the visible "confirm list removal" button
    Then I expect to see the "list removal" error

  Scenario: Opening and closing the list removal dialog multiple times on List View
    When I add a list
    And I ensure the tools panel is open
    And I press the "remove list tools panel" button
    Then I expect to see the "remove list" dialog modal box
    When I press the visible "cancel list removal" button
    Then I expect not to see the "remove list" dialog modal box
    When I press the "remove list tools panel" button
    Then I expect to see the "remove list" dialog modal box
    When I click outside of the "remove list" dialog modal box
    Then I expect not to see the "remove list" dialog modal box

  Scenario: Consequent removal attempt leads to error message disappearance while viewing a list
    When I add a list
    And I ensure the tools panel is open
    And I press the "remove list tools panel" button
    Given Data server is not available
    And I press the visible "confirm list removal" button
    And I ensure the tools panel is open
    And I press the "remove list tools panel" button
    And I press the visible "confirm list removal" button
    Then I expect not to see the "list removal" error

  @heavy
  Scenario: Unsuccessful list removal accompanied by reached items limit leads to error and warning at the same time
    When I add a list
    And I ensure the tools panel is open
    And I add list items to their limit
    And I press the "remove list tools panel" button
    Given Data server is not available
    And I press the visible "confirm list removal" button
    Then I expect to see the warning about items inputs limit reached
    Then I expect to see the "list removal" error

  Scenario: Disabling form controls when pressing the "Confirm list removal" button
    When I add a list
    And I press on the "list note" accordion
    And I ensure the tools panel is open
    And I press the "remove list tools panel" button
    And I press the visible "confirm list removal" button
    Then I expect to see the suffixed list title as tab title
    Then I expect to see sidebar or its button
    Then I expect to see header
    Then I expect to see search
    Then I expect to see tools panel or its button
    Then I expect to see the "list title" input disabled
    Then I expect to see the "list purpose" input disabled
    Then I expect to see the "list note" accordion disabled
    Then I expect to see the "list note" accordion content expanded
    Then I expect to see the "list note" text area disabled
    Then I expect to see list items area
    Then I expect to see the "first" item input disabled
    Then I expect to have the "automatic" item input disabled
    And I ensure the tools panel is open
    Then I expect to see the "add list item" button disabled
    Then I expect to see the "save" button disabled
    Then I expect to see the "copy items" button disabled
    Then I expect to see the "remove list tools panel" button in the loading state
    Then I expect to see the "checklist" switch disabled
    Then I expect to see the "import" button disabled
    Then I expect to see the "print list" button disabled
    And I ensure the tools panel does not disturb
    Then All necessary elements are on the "List View During Removal" page
    Then I expect to see no other elements
