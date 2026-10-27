@ts-implemented
Feature: Perform fulltext search on lists

  We design our search to work only with string, longer then 2 symbols.
  Search need to work as a two separate path:
    1. Full text search as "Gathering" find all matching lists with the word
    2. Partial text search as "ing" find all list with "ing" inside list's name

  Background:
    Given I am "user@example.com"

  Scenario Outline: Attempting to search with an incorrect query
    When I want to search lists
    And I provide a query: <query>
    Then my attempt to search lists fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error>
    Examples:
      | query  | error                      |
      | "a"    | "search-query-too-short"   |
      | ""     | "search-query-empty"       |
      | null   | "search-query-empty"       |
      | []     | "search-query-incorrect"   |
      | {}     | "search-query-incorrect"   |
      | true   | "search-query-incorrect"   |
      | false  | "search-query-incorrect"   |
      | absent | "search-query-missing"     |

  Scenario: Successfully searching for a substring in the lists
    When I want to search lists
    And I provide a query: "view"
    Then I successfully search lists
    And I see the following total number of search results: 1
    Then I want to inspect first list
    Then I see the following list name: Interview
    Then I see the following list id: list-ordinary
    Then I overviewed all fields in found list

  Scenario: Successfully searching for a fulltext in the lists
    When I want to search lists
    And I provide a query: "Article"
    Then I successfully search lists
    And I see the following total number of search results: 1
    Then I want to inspect first list
    Then I see the following list name: Article Reading
    Then I see the following list id: list-for-search
    Then I overviewed all fields in found list

  Scenario: Successfully searching for empty list of lists
    When I want to search lists
    And I provide a query: "some_non_existed_string"
    Then I successfully search lists
    And I see the following total number of search results: 0

  Scenario Outline: Attempting to search with a very long query
    When I want to search lists
    And I provide a query with length: <length>
    Then my attempt to search lists fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "search-query-too-long"
    Examples:
      | length |
      | 71     |
      | 123    |
