type DialogProps = {
  children: React.ReactNode;
};

function Dialog(props: DialogProps) {
  const { children } = props;

  return (
    <dialog className="nes-dialog">
      <form method="dialog">{children}</form>
    </dialog>
  );
}

export default Dialog;
