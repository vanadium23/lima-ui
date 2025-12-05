import { DEFAULT_TEST_ID } from "../../../../features/testIds.ts";
import { DropdownList } from "../../../components/dropdownList/dropdownList.tsx";
import { IconName } from "../../../components/icon/types.ts";
import { IconButton, IconButtonComponentType, IconButtonTheme } from "../../../components/iconButton/iconButton.tsx";

const listsExample = [
  {
    name: "Трололо1",
    id: "https://ya.ru",
  },
  {
    name: "Трололо2",
    id: "https://google.com",
  },
  {
    name: "Трололо3",
    id: "https://google.com",
  },
  {
    name: "Трололо4",
    id: "https://google.com",
  },
  {
    name: "Трололо5",
    id: "https://google.com",
  },
  {
    name: "Трололо6",
    id: "https://google.com",
  },
  {
    name: "Трололо7",
    id: "https://google.com",
  },
  {
    name: "Трололо8 джабуду-джубу азик азик ипалу пагоч азик азик, памаги адеть бикини",
    id: "https://google.com",
  },
  {
    name: "Трололо9",
    id: "https://google.com",
  },
  {
    name: "Трололо10",
    id: "https://google.com",
  },
];

export function DropdownListWrapper() {
  return (
    <DropdownList
      component={(props) => (
        <IconButton
          ref={props.ref}
          componentType={IconButtonComponentType.Button}
          handleClick={props.handleClick}
          testId={DEFAULT_TEST_ID}
          iconName={IconName.Link}
          theme={IconButtonTheme.Quaternary}
          ariaLabel={"Меню импортов"}
        />
      )}
      testId={DEFAULT_TEST_ID}
    >
      {listsExample}
    </DropdownList>
  );
}
