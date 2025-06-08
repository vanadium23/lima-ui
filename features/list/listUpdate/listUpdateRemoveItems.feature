Feature: Removing items from an existing list

  Background:
    When I clear all data
    And I add a list
    And I refresh the page

  Scenario: Removing an item from an existing list
    When I ensure the tools panel is open
    And I press the "add list item" button
    And I ensure the tools panel does not disturb
    And I type some text with length less or equal to the one of "second item" input limit
    And I press the "save" button
    And I wait for the list update to complete
    And I refresh the page
    And I hover "second list item"
    And I press the "open context menu second item" button
    And I press the visible "remove list item" menu item
    Then I expect to see the "save" button enabled
    When I press the "save" button
    And I wait for the list update to complete
    Then I expect to see the "save" button disabled
    And I expect not to see the "second item" input with the text I provided
    When I refresh the page
    And I wait for the page to load
    Then I expect not to see the "second item" input with the text I provided

  Scenario: Removing multiple items from an existing list
    When I ensure the tools panel is open
    And I press the "add list item" button
    And I type some text with length less or equal to the one of "second item" input limit
    And I press the "add list item" button
    And I type some text with length less or equal to the one of "third item" input limit
    And I press the "add list item" button
    And I ensure the tools panel does not disturb
    And I type some text with length less or equal to the one of "forth item" input limit
    And I press the "save" button
    And I wait for the list update to complete
    And I refresh the page
    And I hover "forth list item"
    And I press the "open context menu forth item" button
    And I press the visible "remove list item" menu item
    And I hover "third list item"
    And I press the "open context menu third item" button
    And I press the visible "remove list item" menu item
    And I hover "second list item"
    And I press the "open context menu second item" button
    And I press the visible "remove list item" menu item
    Then I expect to see the "save" button enabled
    When I press the "save" button
    And I wait for the list update to complete
    Then I expect to see the "save" button disabled
    And I expect not to see the "second item" input with the text I provided
    And I expect not to see the "third item" input with the text I provided
    And I expect not to see the "forth item" input with the text I provided
    When I refresh the page
    And I wait for the page to load
    Then I expect not to see the "second item" input with the text I provided
    And I expect not to see the "third item" input with the text I provided
    And I expect not to see the "forth item" input with the text I provided

  Scenario: Imitating a removed list item should not disable the save button
    When I ensure the tools panel is open
    And I press the "add list item" button
    And I ensure the tools panel does not disturb
    And I type some text with length less or equal to the one of "second item" input limit
    And I press the "save" button
    And I wait for the list update to complete
    And I hover "second list item"
    And I press the "open context menu second item" button
    And I press the visible "remove list item" menu item
    And I ensure the tools panel is open
    When I press the "add list item" button
    And I ensure the tools panel does not disturb
    And I type the text that was in the removed "second item" input
    Then I expect to see the "save" button enabled

  Scenario: Seeing remove item menu item disabled for the only one list item in an existing list
    When I hover "automatic list item"
    And I press the "open context menu for automatic list item" button
    And I press the visible "remove list item" menu item
    And I hover "first list item"
    And I press the "open context menu first item" button
    Then I expect to see the "remove list item" menu item disabled

  @needs-fixing
  Scenario: Adding list items to the limit and then removing one list item leads to limit warning disappear and buttons enablement
    When I ensure the tools panel is open
    And I add list items to their limit
    And I fill all items inputs with their index
    And I ensure the tools panel does not disturb
    And I press the "save" button
    And I wait for the list update to complete
    # TODO: Нужно определённо избавиться от этого шага.
    #  Сейчас он необходим для того, чтобы список успел обновиться.
    #  Есть подозрение, что база не успевает произвести запись, и игнорирует её
    #  в угоду чтению.
    And I wait for "ensuring that the huge list was created" for the following number of seconds: 3
    And I refresh the page
    Then I expect to see the warning about items inputs limit reached
    And I scroll to the "on the last list item of the limit"
    And I hover "on the last list item of the limit"
    And I press the "open context menu for last list item of the limit" button
    And I press the visible "remove list item" menu item
    Then I expect not to see the warning about items inputs limit reached
    And I ensure the tools panel is open
    And I expect to see the "add list item" button enabled
    And I ensure the tools panel does not disturb
    When I press the "save" button
    And I wait for the list update to complete
    And I refresh the page
    # TODO: Этот шаг валится. Нужно починить интерфейс.
    #  Здесь появляется автопункт и вновь отображает сообщение о лимите.
    #  Видится, что при наличии автопункта сообщение показываться не должно.
    Then I expect not to see the warning about items inputs limit reached
    And I ensure the tools panel is open
    And I expect to see the "add list item" button enabled
    And I ensure the tools panel does not disturb
