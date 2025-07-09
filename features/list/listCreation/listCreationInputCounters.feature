Feature: Seeing the amount of symbols left for typing in the inputs on the List Creation page

  Background:
    When I open List Creation page

  Scenario Outline: Seeing the correct input counter when focusing this input
    And I focus <input name> input
    Then I expect to see the <counter name> counter
    Then I expect <counter name> counter to show the correct limit

    Examples:
      | input name   | counter name       |
      | "list title" | "list title input" |

  Scenario Outline: Seeing the correct counter remainder with some text in the input while creating a list
    And I focus <input name> input
    And I type some text with length less or equal to the one of <input name> input limit
    Then I expect <counter name> counter to show the correct remaining value

    Examples:
      | input name     | counter name         |
      | "list title"   | "list title input"   |
      | "list purpose" | "list purpose input" |
      | "first item"   | "first item input"   |

  Scenario Outline: Not being able to type more text than in input's limit while creating a list
    And I focus <input name> input
    And I type some text with length more than of <input name> input limit
    Then I expect <counter name> counter to show 0
    Then I expect <input name> input content length to be equal to its limit

    Examples:
      | input name     | counter name         |
      | "list title"   | "list title input"   |
      | "list purpose" | "list purpose input" |
      | "first item"   | "first item input"   |
