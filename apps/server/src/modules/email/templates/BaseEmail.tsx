import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Tailwind,
  Text,
} from 'react-email';
import type { ReactNode } from 'react';

type EmailAction = {
  url: string;
  label: string;
};

type BaseEmailProps = {
  preview: string;
  heading: string;
  children: ReactNode;
  action?: EmailAction;
};

export const BaseEmail = ({ preview, heading, children, action }: BaseEmailProps) => {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="bg-neutral-100 font-sans">
          <Container className="mx-auto max-w-[480px] rounded-2xl bg-white p-8">
            <Heading className="m-0 mb-4 font-semibold text-neutral-900 text-xl">{heading}</Heading>

            {children}

            {action && (
              <>
                <Button
                  href={action.url}
                  className="box-border block rounded-lg bg-neutral-900 px-5 py-2.5 text-center font-medium text-sm text-white no-underline"
                >
                  {action.label}
                </Button>

                <Hr className="my-6 border-neutral-200" />

                <Text className="m-0 text-neutral-400 text-xs leading-5">
                  If the button does not work, copy this link into your browser:
                  <br />
                  <Link href={action.url} className="text-neutral-500 underline">
                    {action.url}
                  </Link>
                </Text>
              </>
            )}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
