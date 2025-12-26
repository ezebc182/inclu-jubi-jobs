import { test, expect } from "@playwright/test";

test.describe("Smoke Tests - JubiJobs", () => {
  test("home page loads correctly", async ({ page }) => {
    await page.goto("/");

    // Verificar que el título principal esté presente
    await expect(page.locator("h1")).toContainText(
      "Trabajos para jubilados"
    );

    // Verificar que los CTAs estén presentes
    await expect(
      page.getByRole("link", { name: /Buscar empleos/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Publicar empleo/i })
    ).toBeVisible();
  });

  test("empleos page loads and shows jobs", async ({ page }) => {
    await page.goto("/empleos");

    // Verificar título
    await expect(page.locator("h1")).toContainText("Empleos disponibles");

    // Verificar que haya filtros
    await expect(page.getByText("Filtros de búsqueda")).toBeVisible();

    // Verificar que se muestren empleos o empty state
    const hasJobs =
      (await page.locator('[class*="JobCard"]').count()) > 0 ||
      (await page.getByText("No se encontraron empleos").count()) > 0;
    expect(hasJobs).toBeTruthy();
  });

  test("navigation works correctly", async ({ page }) => {
    await page.goto("/");

    // Navegar a empleos
    await page.getByRole("link", { name: /empleos/i }).first().click();
    await expect(page).toHaveURL(/\/empleos/);

    // Navegar a empresas
    await page.getByRole("link", { name: /empresas/i }).first().click();
    await expect(page).toHaveURL(/\/empresas/);

    // Navegar a página de discapacidad
    await page.goto("/discapacidad");
    await expect(page.locator("h1")).toContainText("Trabajo inclusivo");
  });

  test("filters work on empleos page", async ({ page }) => {
    await page.goto("/empleos");

    // Aplicar filtro de provincia
    await page.selectOption('select[name="province"]', "Córdoba");
    await page.getByRole("button", { name: /Aplicar filtros/i }).click();

    // Verificar que la URL tenga el parámetro
    await expect(page).toHaveURL(/provincia=C%C3%B3rdoba/);
  });

  test("como funciona page has complete information", async ({ page }) => {
    await page.goto("/como-funciona");

    await expect(page.locator("h1")).toContainText("¿Cómo funciona JubiJobs?");

    // Verificar que estén las secciones para candidatos y empresas
    await expect(page.getByText("Para candidatos")).toBeVisible();
    await expect(page.getByText("Para empresas")).toBeVisible();
  });

  test("accesibilidad page loads", async ({ page }) => {
    await page.goto("/accesibilidad");

    await expect(page.locator("h1")).toContainText("Accesibilidad");
    await expect(page.getByText("Tipografía grande")).toBeVisible();
  });

  test("footer links work", async ({ page }) => {
    await page.goto("/");

    // Verificar que el footer tenga los links
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: /Privacidad/i })).toBeVisible();
    await expect(footer.getByRole("link", { name: /Términos/i })).toBeVisible();
    await expect(footer.getByRole("link", { name: /Accesibilidad/i })).toBeVisible();
  });

  test("skip to content link works", async ({ page }) => {
    await page.goto("/");

    // El link de skip debe estar en el DOM pero oculto
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();

    // Al hacer focus debería ser visible
    await skipLink.focus();
    await expect(skipLink).toBeFocused();
  });
});

test.describe("Accessibility Tests", () => {
  test("all pages have proper heading hierarchy", async ({ page }) => {
    const pages = ["/", "/empleos", "/empresas", "/discapacidad"];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      const h1Count = await page.locator("h1").count();
      expect(h1Count).toBeGreaterThan(0);
      expect(h1Count).toBeLessThanOrEqual(1); // Solo un H1 por página
    }
  });

  test("buttons have sufficient size", async ({ page }) => {
    await page.goto("/");

    const buttons = await page.locator("button, a[role='button']").all();

    for (const button of buttons.slice(0, 5)) { // Verificar primeros 5
      const box = await button.boundingBox();
      if (box) {
        // Botones deben tener al menos 44x44px (WCAG guideline)
        expect(box.height).toBeGreaterThanOrEqual(40);
      }
    }
  });
});
