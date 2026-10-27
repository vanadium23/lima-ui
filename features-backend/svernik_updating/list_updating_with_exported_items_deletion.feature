@ts-implemented
Feature: Updating a list with exported items deletion validation

  Background:
    Given I am "user@example.com"
    When I create a new list
    And I create the following number of lists: 1
    And I add items from the original list to other lists
    And I ask for the original list

  Scenario Outline: Attempting to delete an exported item from a list with erroneous exported items deletion methods
    And I provide a replacement for items
    And I provide the following exported items deletion references: <exported items deletion methods>
    And I provide the following mark of the absence of a reason for latest update: true
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error message>

    Examples:
      | exported items deletion methods | error message                               |
      | absent                          | "exported-items-deletion-methods-missing"   |
      | null                            | "exported-items-deletion-methods-empty"     |
      | ""                              | "exported-items-deletion-methods-incorrect" |
      | "some other string"             | "exported-items-deletion-methods-incorrect" |
      | 123                             | "exported-items-deletion-methods-incorrect" |
      | {}                              | "exported-items-deletion-methods-incorrect" |
      | false                           | "exported-items-deletion-methods-incorrect" |
      | true                            | "exported-items-deletion-methods-incorrect" |

  Scenario Outline: Attempting to update a list with multiple incorrect exported items deletion methods
    And I provide a replacement for items
    And I provide the following mark of the absence of a reason for latest update: true
    But I provide several incorrect exported items deletion methods: <incorrect exported items deletion methods>
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the set of following errors: <exported items deletion methods incorrect error messages>

    Examples:
      | incorrect exported items deletion methods | exported items deletion methods incorrect error messages                                                                                                                                                                       |
      | "[\"\", \"some string\", 123]"            | "[\"exported-item-deletion-method-reference-incorrect\", \"exported-item-deletion-method-reference-incorrect\", \"exported-item-deletion-method-reference-incorrect\"]"                                                        |
      | "[[], false, true, null]"                 | "[\"exported-item-deletion-method-reference-incorrect\", \"exported-item-deletion-method-reference-incorrect\", \"exported-item-deletion-method-reference-incorrect\", \"exported-item-deletion-method-reference-incorrect\"]" |

  Scenario Outline: Attempting to update a list with mixed incorrect and correct exported items deletion methods
    And I provide a replacement for items
    And I provide the following mark of the absence of a reason for latest update: true
    But I provide several incorrect exported items deletion methods: <incorrect exported items deletion methods>
    And I provide several correct exported items deletion methods
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the set of following errors: <exported items deletion methods incorrect error messages>

    Examples:
      | incorrect exported items deletion methods | exported items deletion methods incorrect error messages                                                                                                                                                                       |
      | "[\"\", \"some string\", 123]"            | "[\"exported-item-deletion-method-reference-incorrect\", \"exported-item-deletion-method-reference-incorrect\", \"exported-item-deletion-method-reference-incorrect\"]"                                                        |
      | "[[], false, true, null]"                 | "[\"exported-item-deletion-method-reference-incorrect\", \"exported-item-deletion-method-reference-incorrect\", \"exported-item-deletion-method-reference-incorrect\", \"exported-item-deletion-method-reference-incorrect\"]" |

  Scenario Outline: Attempting to update a list with exported items deletion methods with erroneous references
    And I provide a replacement for items
    And I plan to delete the following number of exported items: 1
    And I provide the following exported items deletion ids: <exported items deletion ids>
    And I provide the following exported items deletion methods: "deletion"
    And I provide the following mark of the absence of a reason for latest update: true
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error message>
    Then I see the erroneous exported items deletion method's index in the error message
    Then I see the erroneous exported items deletion method's textual representation in the error message

    Examples:
      | exported items deletion ids | error message         |
      | ""                          | "reference-empty"     |
      | null                        | "reference-empty"     |
      | false                       | "reference-incorrect" |
      | true                        | "reference-incorrect" |
      | 123                         | "reference-incorrect" |
      | {}                          | "reference-incorrect" |
      | []                          | "reference-incorrect" |

  Scenario Outline: Attempting to update a list with exported items deletion methods with erroneous deletion method
    And I provide a replacement for items
    And I plan to delete the following number of exported items: 1
    And I provide the following exported items deletion ids: "item-some-id"
    And I provide the following exported items deletion methods: <exported items deletion methods>
    And I provide the following mark of the absence of a reason for latest update: true
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error message>
    Then I see the erroneous exported items deletion method's index in the error message
    Then I see the erroneous exported items deletion method's textual representation in the error message

    Examples:
      | exported items deletion methods | error message                                                       |
      | absent                          | "exported-item-deletion-method-reference-deletion-method-missing"   |
      | ""                              | "exported-item-deletion-method-reference-deletion-method-empty"     |
      | null                            | "exported-item-deletion-method-reference-deletion-method-empty"     |
      | "some other string"             | "exported-item-deletion-method-reference-deletion-method-incorrect" |
      | 123                             | "exported-item-deletion-method-reference-deletion-method-incorrect" |
      | {}                              | "exported-item-deletion-method-reference-deletion-method-incorrect" |
      | []                              | "exported-item-deletion-method-reference-deletion-method-incorrect" |
      | false                           | "exported-item-deletion-method-reference-deletion-method-incorrect" |
      | true                            | "exported-item-deletion-method-reference-deletion-method-incorrect" |

  Scenario: Ignoring exported item deletion method when item is not removed
    And I provide the exported items deletion method for one of the items of the original list
    And I provide a reason for latest update
    Then I successfully update the svernik and see properly sorted updated version of it
    Then I see the mentioned item remain in the updated list

  Scenario: Ignoring empty exported item deletion method when item is not removed
    And I provide the following exported items deletion references: []
    And I provide a reason for latest update
    Then I successfully update the svernik and see properly sorted updated version of it

  Scenario: Attempting to delete the same exported item with different deletion methods
    When I want to update the original list
    And I use the already existing items as the base
    And I delete an exported item from the original list
    And I plan to delete the following number of exported items: 2
    And I provide the deleted exported item id for all deletion methods
    And I provide the following exported items deletion method for method at index 0: "deletion"
    And I provide the following exported items deletion method for method at index 1: "insertion"
    And I provide the following mark of the absence of a reason for latest update: true
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "exported-item-deletion-method-reference-duplicated-with-different-method"
    Then I see the erroneous exported items deletion method's index in the error message
    Then I see the erroneous exported items deletion method's textual representation in the error message

  Scenario Outline: Ignoring duplicate deletion methods with the same method
    When I want to update the original list
    And I use the already existing items as the base
    And I delete an exported item from the original list
    And I plan to delete the following number of exported items: 2
    And I provide the deleted exported item id for all deletion methods
    And I provide the following exported items deletion method for method at index 0: <deletion method>
    And I provide the following exported items deletion method for method at index 1: <deletion method>
    And I provide the following mark of the absence of a reason for latest update: true
    Then I successfully update the svernik and see properly sorted updated version of it
    When I ask for the original lists
    Then I do not see the deleted exported item in the original lists items

    Examples:
      | deletion method |
      | "deletion"      |
      | "insertion"     |

  Scenario: Attempting to delete an exported item without providing deletion method
    When I want to update the original list
    And I use the already existing items as the base
    And I delete an exported item from the original list
    And I provide the following exported items deletion references: []
    And I provide the following mark of the absence of a reason for latest update: true
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "exported-item-deletion-method-missing"
    Then I see the deleted exported item id in the error message

  Scenario: Attempting to delete multiple exported items without providing deletion methods
    When I want to update the original list
    And I use the already existing items as the base
    And I delete the following number of exported items from the original list: 2
    And I provide the following exported items deletion references: []
    And I provide the following mark of the absence of a reason for latest update: true
    Then my attempt to update a svernik fails
    Then I see the following HTTP status code: 400
    Then I see the set of following errors: "[\"exported-item-deletion-method-missing\", \"exported-item-deletion-method-missing\"]"
    Then I see all deleted exported items ids in the error messages

  Scenario: Flawlessly deleting an imported item from a list
    And I ensure the following number of items of the prepared lists: 1
    Then I do not see the deleted list items in the original lists items
