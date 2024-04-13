import useLoading from "@/hooks/useLoading";
import { FormWrapper } from "./FormWrapper";

type PreimageData = {
  preimage: string;
  response: string;
};

type PreimageFormProps = PreimageData & {
  apiUrl: string;
  macaroon: string;
  preimage: string;
  updateFields: (fields: Partial<PreimageData>) => void;
  next: () => void;
  back: () => void;
};

const PreimageForm = ({
  apiUrl,
  macaroon,
  preimage,
  next,
  back,
  updateFields,
}: PreimageFormProps) => {
  const { isLoading, stopLoading, startLoading } = useLoading();
  const handleSubmit = async () => {
    startLoading();
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `L402 ${macaroon}:${preimage}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        updateFields({ response: JSON.stringify(result) });
        next();
        stopLoading();
      } else {
        // TODO: Add in constants
        if (response.status === 402) {
          alert(
            "Payment Required: You need to pay before accessing this resource."
          );
        } else {
          alert("Error: " + response.statusText);
        }
        stopLoading();
      }
    } catch (error) {
      alert(error);
      stopLoading()
    }
  };

  return (
    <FormWrapper title="Payment Verification" isLoading={isLoading}>
      <label>Enter Preimage</label>
      <input
        autoFocus
        required
        type="text"
        value={preimage}
        onChange={(e) => updateFields({ preimage: e.target.value })}
        style={{ border: "solid" }}
      />
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          gap: ".5rem",
        }}
      >
        <button onClick={back}>Back</button>
        <button onClick={handleSubmit}>Next</button>
      </div>
    </FormWrapper>
  );
};

export default PreimageForm;
