import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  /** Merge props onto a single child (e.g. custom anchor). */
  asChild?: boolean;
};

type ButtonAsButton = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = SharedProps &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "className" | "children" | "href"
  > & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClass: Record<ButtonVariant, string> = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  ghost: "btn btn-ghost",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

function buttonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string,
) {
  return cn(variantClass[variant], sizeClass[size], className);
}

function Slot({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & Record<string, unknown>) {
  const child = Children.only(children);
  if (!isValidElement(child)) {
    return null;
  }
  const element = child as ReactElement<{ className?: string }>;
  return cloneElement(element, {
    ...props,
    className: cn(className, element.props.className),
  });
}

/**
 * FISHEYE CTA control — primary (brass fill), secondary (outline), ghost (minimal).
 * Never uses underline hover. Pass `href` for navigation, or `asChild` to style a child.
 */
export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  const variant = props.variant ?? "primary";
  const size = props.size ?? "md";
  const classes = buttonClasses(variant, size, props.className);

  if (props.asChild) {
    const { asChild: _a, variant: _v, size: _s, className: _c, children, ...rest } =
      props;
    return (
      <Slot className={classes} {...rest}>
        {children}
      </Slot>
    );
  }

  if ("href" in props && props.href != null) {
    const {
      href,
      variant: _v,
      size: _s,
      className: _c,
      asChild: _a,
      children,
      ...anchorRest
    } = props;

    const external =
      /^(https?:|mailto:|tel:|sms:)/i.test(href) || href.startsWith("//");

    if (external) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...anchorRest}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...anchorRest}
      >
        {children}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    className: _c,
    asChild: _a,
    children,
    type = "button",
    ...buttonRest
  } = props as ButtonAsButton;

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      className={classes}
      {...buttonRest}
    >
      {children}
    </button>
  );
});
