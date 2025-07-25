Feature: Searching for lists

  Background:
    When I clear all data
    And I add a list

  Scenario Outline: Interacting with search bar
    When I open <PageMeaning> page with "search interaction" accounting
    And I ensure search is visible
    And I focus "search bar" input
    And I wait for "dialog to remain hidden" for the following number of seconds: 0.5
    Then I expect not to see the search "dialog"
    And I add the following text into the "search bar": "a"
    And I wait for "dialog to remain hidden" for the following number of seconds: 0.5
    Then I expect not to see the search "dialog"
    And I add the following text into the "search bar": "b"
    Then I expect to see the search "dialog loading"
    And I add the following text into the "search bar": "c"
    Then I expect to see the search "dialog loading"
    And I add the following text into the "search bar": "d"
    Then I expect to see the search "dialog loading"
    And I clear the "search bar" input
    And I wait for "dialog to remain hidden" for the following number of seconds: 0.5
    Then I expect not to see the search "dialog"

    Examples:
      | PageMeaning     |
      | "My Lists"      |
      | "List Creation" |
      | "Latest List"   |

  Scenario: Not being able to type more text than in search bar's limit
    When I ensure search is visible
    And I type some text with length more than of "search bar" input limit
    Then I expect "search bar" input content length to be equal to its limit

  Scenario Outline: Searching for a specific list
    When I add a list with the following title: "Пробуем поиск"
    When I open <PageMeaning> page with <AccountingName> accounting
    And I ensure search is visible
    And I type the following text into the "search bar": <SearchQuery>
    Then I expect to see the search "dialog"
    Then I expect to have the following number of search results: 1
    Then I expect to see the search result with the following text: "Пробуем поиск"
    And I press the "first" search result
    Then I expect to be on the "Some List" page

    Examples:
      | PageMeaning     | SearchQuery     | AccountingName                     |
      | "My Lists"      | "Пробуем поиск" | "search single item full words"    |
      | "My Lists"      | "Проб"          | "search single item partial words" |
      | "List Creation" | "Пробуем поиск" | "search single item full words"    |
      | "List Creation" | "Про"           | "search single item partial words" |
      | "Latest List"   | "Пробуем поиск" | "search single item full words"    |
      | "Latest List"   | "оиск"          | "search single item partial words" |

  Scenario Outline: Seeing several lists in search results
    When I add a list with the following title: "Пробуем поиск"
    And I add a list with the following title: "Пробуем поиск 2"
    And I add a list with the following title: "Пробуем поиск 3"
    And I add a list with the following title: "Пробуем поиск 4"
    And I ensure search is visible
    And I type the following text into the "search bar": <SearchQuery>
    Then I expect to see the search "dialog"
    Then I expect to have the following number of search results: 4
    Then I expect to see the search result with the following text: "Пробуем поиск"
    Then I expect to see the search result with the following text: "Пробуем поиск 2"
    Then I expect to see the search result with the following text: "Пробуем поиск 3"
    Then I expect to see the search result with the following text: "Пробуем поиск 4"

    Examples:
      | SearchQuery |
      | "Пробуем"   |
      | "Проб"      |

  Scenario: Seeing both full and partial matches in search results
    When I add a list with the following title: "Проб поиск"
    And I add a list with the following title: "Проб поиск 2"
    And I add a list with the following title: "Пробуем поиск"
    And I add a list with the following title: "Пробуем поиск 2"
    And I ensure search is visible
    And I type the following text into the "search bar": "Проб"
    Then I expect to see the search "dialog"
    Then I expect to have the following number of search results: 4
    Then I expect to see the search result with the following text: "Проб поиск"
    Then I expect to see the search result with the following text: "Проб поиск 2"
    Then I expect to see the search result with the following text: "Пробуем поиск"
    Then I expect to see the search result with the following text: "Пробуем поиск 2"

  Scenario: Seeing all matches for several words
    When I add a list with the following title: "Проба поиска"
    And I add a list with the following title: "Проба поиска 2"
    And I add a list with the following title: "Hello world"
    And I add a list with the following title: "Hello world 2"
    And I ensure search is visible
    And I type the following text into the "search bar": "Проба Hello"
    Then I expect to see the search "dialog"
    Then I expect to have the following number of search results: 4
    Then I expect to see the search result with the following text: "Проба поиска"
    Then I expect to see the search result with the following text: "Проба поиска 2"
    Then I expect to see the search result with the following text: "Hello world"
    Then I expect to see the search result with the following text: "Hello world 2"

  Scenario: Seeing empty search results
    When I ensure search is visible
    And I type the following text into the "search bar": "Проб"
    Then I expect to see the search "dialog empty"
    Then I expect to have the following number of search results: 0

  Scenario: Seeing scrollable search results
    When I add a list with the following title: "Проба поиска"
    And I add a list with the following title: "Проба поиска 2"
    And I add a list with the following title: "Проба поиска 3"
    And I add a list with the following title: "Проба поиска 4"
    And I add a list with the following title: "Проба поиска 5"
    And I add a list with the following title: "Проба поиска 6"
    And I add a list with the following title: "Проба поиска 7"
    And I add a list with the following title: "Проба поиска 8"
    And I add a list with the following title: "Проба поиска 9"
    And I add a list with the following title: "Проба поиска 10"
    And I ensure search is visible
    And I type the following text into the "search bar": "Проба"
    Then I expect to see the search "dialog"
    Then I expect to have the following number of search results: 10
    When I scroll to the bottom of the search results
    Then I expect to see the "last" search result

  Scenario: Seeing the on-limit amount of search results
    When I clear all data
    And I add lists to their limit
    And I ensure search is visible
    And I type the following text into the "search bar": "Здесь"
    Then I expect to see the search "dialog"
    Then I expect to have the following number of search results: 200

  Scenario: Seeing error notification when search request fails
    Given Data server is not available
    And I ensure search is visible
    And I type the following text into the "search bar": "test search"
    And I wait for "search error to appear" for the following number of seconds: 2
    Then I expect to see the search "error notification"
    When I press the "close search error notification" button
    Then I expect not to see the search "error notification"

  Scenario: Pressing search button runs search again
    When I add a list with the following title: "Проба поиска"
    When I ensure search is visible
    And I type the following text into the "search bar": "Проба"
    And I wait for "search to complete" for the following number of seconds: 2
    And I press the "search" button
    Then I expect to see the search "dialog loading"
    Then I expect to see the search "dialog"
    Then I expect to have the following number of search results: 1
    Then I expect to see the search result with the following text: "Проба поиска"
