Feature: Seeing the basis of the automatically added item

  Background:
    When I open List Creation page

  Scenario: Seeing the new item automatically added
    And I type some text with length less or equal to the one of "first item" input limit
    Then I expect to see the "second item" input enabled

  Scenario: Seeing the automatically added item removed when the previous is cleared
    And I type some text with length less or equal to the one of "first item" input limit
    Then I expect to see the "second item" input enabled
    And I clear the "first item" input
    Then I expect not to see the "second" item input

  Scenario: Reaching limit via the automatically added item
    And I add list items to their limit via automatically added item
    Then I expect to see the warning about items inputs limit reached
    Then I expect to see the "add list item" button "disabled" with the following text: "Добавить пункт"
    Then I expect not to see the "exceeding limit" item input
