- name: Write main.c
  run: |
    cat << 'EOF' > main.c
    #include <switch.h>
    #include <switch/services/web-browser.h>
    #include <stdio.h>
    #include <stdlib.h>

    int main(int argc, char **argv) {
        if (romfsInit() != 0) {
            printf("romfsInit failed\n");
            return 1;
        }

        WebBrowserConfig config;
        webBrowserConfigInitialize(&config);
        config.url = "romfs:/index.html";
        config.enableCache = false;
        config.javascriptEnabled = true;
        config.allowAllFiles = true;

        WebBrowser *browser = NULL;
        Result rc = webBrowserCreate(&config, &browser);
        if (R_FAILED(rc)) {
            printf("webBrowserCreate failed: %d\n", rc);
            romfsExit();
            return 1;
        }

        webBrowserWaitForClose(browser);
        webBrowserClose(browser);
        romfsExit();
        return 0;
    }
    EOF
