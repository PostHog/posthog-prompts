import './Banner.css'

export function NewFeatureBanner() {
    //const { upgradeLink } = useValues(billingLogic)

    return (
        <div className="banner">
            <strong>🧪 Introducing Experimentation!</strong> Test changes to your product and how they impact your
            users.
            {/* <LemonButton to={upgradeLink} type="secondary" size="small" data-attr="site-banner-upgrade-experimentation">
                Upgrade
            </LemonButton> */}
            <a
                href="https://posthog.com/docs/user-guides/experimentation?utm_medium=in-product&utm_campaign=upgrade-site-banner-learn-more"
                target="_blank"
                className="ml-2"
            >
                Learn more
            </a>
        </div>
    )
}
