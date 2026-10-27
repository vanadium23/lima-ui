@ts-implemented
Feature: user password reset process

  Background:
    When I want to request password reset

  Scenario: Request password reset for unregistered email returns success but no email
    When I clear my email inbox
    And I request password reset with an unregistered email
    Then I see the following HTTP status code: 200
    And I see no password reset email

  Scenario: Request password reset with valid email
    Given a user is registered
    When I request password reset with the user's email
    Then I see the following HTTP status code: 200
    And I check my emails
    And I see a password reset email with token
    When I confirm password reset with the token and a new password
    Then I see the following HTTP status code: 200

  Scenario Outline: Request password reset with garbage data fails
    When I request password reset with incorrect data: <garbage>
    Then my attempt to request password reset fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "password-reset-incorrect"
    Examples:
      | garbage   |
      | []        |
      | 123       |
      | false     |
      | true      |
      | "garbage" |

  Scenario: Unknown fields are ignored in password reset request
    В этом случае у нас будто бы пустой объект приходит, так как
    дополнительное поле игнорируется. Поэтому и ошибка аналогичная приёму {}.
    When I request password reset with unknown fields
    Then my attempt to request password reset fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "email-missing"

  Scenario Outline: Request password reset with erroneous email
    When I request password reset with email: <email>
    Then my attempt to request password reset fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error message>
    Examples:
      | email  | error message       |
      | absent | "email-missing"     |
      | null   | "email-empty"       |
      | ""     | "email-empty"       |
      | 123    | "email-incorrect"   |
      | {}     | "email-incorrect"   |
      | []     | "email-incorrect"   |
      | false  | "email-incorrect"   |
      | true   | "email-incorrect"   |
      | "some" | "email-invalid"     |

  Scenario Outline: Request password reset confirmation with garbage data fails
    When I confirm password reset with incorrect data: <garbage>
    Then my attempt to confirm password reset fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "password-reset-incorrect"
    Examples:
      | garbage   |
      | []        |
      | 123       |
      | false     |
      | true      |
      | "garbage" |

  Scenario Outline: Request password reset confirmation with erroneous token
    When I confirm password reset with token: <token>
    Then my attempt to confirm password reset fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error message>
    Examples:
      | token       | error message     |
      | absent      | "token-missing"   |
      | null        | "token-empty"     |
      | ""          | "token-empty"     |
      | 123         | "token-incorrect" |
      | {}          | "token-incorrect" |
      | []          | "token-incorrect" |
      | false       | "token-incorrect" |
      | true        | "token-incorrect" |
      | "garbage"   | "token-invalid"   |

  Scenario: Request password reset confirmation with already used token fails
    Given a user is registered
    When I request password reset with the user's email
    Then I see the following HTTP status code: 200
    And I check my emails
    And I see a password reset email with token
    When I confirm password reset with the token and a new password
    Then I see the following HTTP status code: 200
    When I confirm password reset with the same token and a new password
    Then my attempt to confirm password reset fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "token-invalid"

  Scenario Outline: Request password reset confirmation with erroneous password
    Given a user is registered
    When I request password reset with the user's email
    Then I see the following HTTP status code: 200
    And I check my emails
    And I see a password reset email with token
    When I confirm password reset with the token and password: <password>
    Then my attempt to confirm password reset fails
    Then I see the following HTTP status code: 400
    Then I see the following error: <error message>
    Examples:
      | password | error message                  |
      | absent   | "password-missing"             |
      | null     | "password-empty"               |
      | ""       | "password-empty"               |
      | 123      | "password-incorrect"           |
      | {}       | "password-incorrect"           |
      | []       | "password-incorrect"           |
      | false    | "password-incorrect"           |
      | true     | "password-incorrect"           |
      | "weak"   | "password-weak"                |
      | "12345678901234567890123456789012345678901234567890123456789012345" | "password-too-long" |

  Scenario: Request password reset confirmation with password confirmation mismatch fails
    Given a user is registered
    When I request password reset with the user's email
    Then I see the following HTTP status code: 200
    And I check my emails
    And I see a password reset email with token
    When I confirm password reset with the token and mismatched passwords
    Then my attempt to confirm password reset fails
    Then I see the following HTTP status code: 400
    Then I see the following error: "password-confirmation-mismatch"
