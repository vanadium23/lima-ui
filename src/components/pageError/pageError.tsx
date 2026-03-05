import type { JSX } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import { Button, ButtonComponentType } from "../button/button.tsx";
import { Title, TitlePosition } from "../title/title.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./pageError.css";

export enum PageErrorType {
  ExpiredLink = "expiredLink",
  NotFound = "notFound",
}

type PageErrorProps = {
  type: PageErrorType;
  title: string;
  children: JSX.Element;
};

export const PageError = (props: Testable<PageErrorProps>) => {
  return (
    <section class={`pageError pageError_${props.type}`}>
      <div class="pageError__wrapper wrapper">
        <Title position={TitlePosition.Center} testId={props.testId}>
          {props.title}
        </Title>
        <p class="pageError__text">{props.children}</p>
        <Button componentType={ButtonComponentType.Link} href="/" testId={DEFAULT_TEST_ID}>
          На главную
        </Button>
      </div>
    </section>
  );
};
