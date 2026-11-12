<template>
    <aside class="banner" role="note">
        <p>
            Die Inf-Lab Tools sind archiviert und werden nicht mehr aktiv
            weiterbetrieben.
        </p>
        <p>
            Aktuelle Aufgaben findest du auf
            <a class="banner__link" href="https://inf.zone">inf.zone</a>
            und in den Tutorien.
        </p>
    </aside>
</template>

<style lang="css" scoped>
.banner {
    border-top: 1px solid var(--bulma-warning-on-scheme);
    border-bottom: 1px solid var(--bulma-warning-on-scheme);

    background-color: var(--bulma-warning-soft);
    padding: 20px 16px;

    color: var(--bulma-warning-bold);
    font-size: 1.125rem;
    line-height: 1.5;
    text-align: center;
}

.banner__link {
    color: inherit;
    font-weight: var(--bulma-weight-semibold);
    text-decoration: underline;
    text-underline-offset: 2px;
}

.banner__link:hover {
    color: inherit;
    text-decoration-thickness: 2px;
}
</style>
