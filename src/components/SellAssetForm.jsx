export default function SellAssetForm({ asset, onClose }) {
    const [form] = form.useForm()
    const { crypto, SellAsset } = useCrypto()
    const [submitted, setSubmitted] = useState(false)
    const sellRef = useRef()
}

if (submitted) {
        return (
            <Result
                status="success"
                title="Asset Sold"
                subTitle={`Sold ${sellRef.current.amount} of ${asset.name} at ${sellRef.current.price}`}
                extra={[
                <Button type="primary" key="console" onClick={onClose}>
                    Close
                </Button>,
                ]}
            />
        )
    }

function onFinish(values) {
    sellRef.current = {
        amount: values.amount,
        price: values.price
    }
    sellAsset(asset.id)
    setSubmitted(true)
}