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
  Section,
  Text,
} from 'react-email';
import { emailStyles } from './email-styles';
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
      <Body style={emailStyles.body}>
        <Container style={emailStyles.outer}>
          <Section style={emailStyles.card}>
            <Heading style={emailStyles.heading}>{heading}</Heading>

            {children}

            {action && (
              <>
                <Button href={action.url} style={emailStyles.button}>
                  {action.label}
                </Button>

                <Hr style={emailStyles.hr} />

                <Text style={emailStyles.footnote}>
                  If the button does not work, copy this link into your browser:
                  <br />
                  <Link href={action.url} style={emailStyles.link}>
                    {action.url}
                  </Link>
                </Text>
              </>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
