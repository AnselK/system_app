import { debounce } from "@src/common/functionUtils";
import { Input, InputProps, Select, SelectProps } from "antd";
import React, { memo, useRef, useState } from "react";
const com_enum = {
  input: Input,
  select: Select,
};

type Key = string | number;
type E = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | Key;
interface UseInput {
  defaultValue?: Key;
  target?: "input" | "select";
  beforeChange?: (e: E, cb: (val: Key | undefined) => void) => void;
}

type PropsType<T> = T extends "select" ? SelectProps : InputProps;

function useInput<K, T = "input">(defaultValue?: K) {
  const compositionRef = useRef<boolean>(false);
  const [value, setValue] = useState<K>(defaultValue as any);

  const change: PropsType<T>["onChange"] = debounce((e) => {
    if (typeof e !== "object") {
      setValue(e);
    } else {
      if (e.nativeEvent.inputType !== "insertCompositionText") {
        if (compositionRef.current) {
          setValue(e.nativeEvent?.data);
        } else {
          setValue(e.target?.value);
        }
      }
    }
  });

  const Composition = (e: React.CompositionEvent<HTMLInputElement>) => {
    if (e.type === "compositionupdate") {
      const func = (change as InputProps["onChange"])!;
      func(e as unknown as React.ChangeEvent<HTMLInputElement>);
    } else {
      compositionRef.current = true;
    }
  };

  return [value, change, Composition] as [K, typeof change, typeof Composition];
}

export default useInput;
