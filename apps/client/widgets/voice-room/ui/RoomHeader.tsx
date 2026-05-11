type Props = {
  name: string;
};

export const RoomHeader = ({ name }: Props) => (
  <div className="border-b bg-card px-6 py-2 font-medium text-sm">{name}</div>
);
