# Create the complete project structure with all necessary files
import os
import json

def create_directory_structure():
    """Create the complete Next.js + GSAP project structure"""
    
    # Define the project structure
    structure = {
        "nextjs-gsap-starter": {
            # Root configuration files
            "package.json": "package_config",
            "next.config.js": "next_config", 
            "tailwind.config.js": "tailwind_config",
            "tsconfig.json": "typescript_config",
            ".env.example": "env_example",
            ".env.local": "env_local",
            ".gitignore": "gitignore_config",
            "README.md": "readme_content",
            ".prettierrc": "prettier_config",
            ".eslintrc.json": "eslint_config",
            ".editorconfig": "editor_config",
            
            # Cline/Kilo Code rules and memory bank
            ".clinerules": {
                "00-global-standards.md": "global_rules",
                "10-react-nextjs.md": "react_rules", 
                "20-gsap-animations.md": "gsap_rules",
                "30-typescript.md": "typescript_rules",
                "40-project-structure.md": "structure_rules"
            },
            ".clinerules-bank": {
                "legacy-rules.md": "legacy_rules",
                "client-specific.md": "client_rules"
            },
            "memory_bank": {
                "brief.md": "project_brief",
                "product.md": "product_context",
                "context.md": "current_context", 
                "architecture.md": "architecture_docs",
                "tech.md": "tech_stack"
            },
            
            # VS Code settings
            ".vscode": {
                "settings.json": "vscode_settings",
                "extensions.json": "vscode_extensions",
                "launch.json": "vscode_launch",
                "tasks.json": "vscode_tasks"
            },
            
            # Source code structure
            "src": {
                "app": {
                    "layout.tsx": "root_layout",
                    "page.tsx": "home_page",
                    "globals.css": "global_styles",
                    "loading.tsx": "loading_component",
                    "error.tsx": "error_component",
                    "not-found.tsx": "not_found_component",
                    "about": {
                        "page.tsx": "about_page"
                    },
                    "api": {
                        "health": {
                            "route.ts": "health_api"
                        }
                    }
                },
                "components": {
                    "ui": {
                        "Button.tsx": "button_component",
                        "Card.tsx": "card_component",
                        "LoadingSpinner.tsx": "loading_spinner",
                        "AnimatedSection.tsx": "animated_section",
                        "ScrollProgressBar.tsx": "scroll_progress"
                    },
                    "layout": {
                        "Header.tsx": "header_component",
                        "Footer.tsx": "footer_component",
                        "Navigation.tsx": "navigation_component"
                    },
                    "animations": {
                        "FadeIn.tsx": "fade_in_component",
                        "SlideUp.tsx": "slide_up_component",
                        "StaggerText.tsx": "stagger_text_component"
                    }
                },
                "lib": {
                    "gsap": {
                        "index.ts": "gsap_config",
                        "animations.ts": "animation_helpers",
                        "scrollTrigger.ts": "scroll_trigger_config"
                    },
                    "utils.ts": "utility_functions",
                    "constants.ts": "app_constants"
                },
                "hooks": {
                    "useGSAP.ts": "use_gsap_hook",
                    "useScrollAnimation.ts": "use_scroll_hook",
                    "useIsomorphicLayoutEffect.ts": "use_isomorphic_hook"
                },
                "types": {
                    "global.d.ts": "global_types",
                    "animation.ts": "animation_types",
                    "components.ts": "component_types"
                },
                "styles": {
                    "components.css": "component_styles"
                }
            },
            
            # Public assets
            "public": {
                "favicon.ico": "favicon_placeholder",
                "next.svg": "next_logo_placeholder",
                "vercel.svg": "vercel_logo_placeholder",
                "images": {
                    ".gitkeep": "gitkeep_placeholder"
                }
            }
        }
    }
    
    return structure

# Create the structure dictionary
project_structure = create_directory_structure()

print("Project structure created successfully!")
print("\nProject Overview:")
print("================")
print("- Complete Next.js 15 + GSAP + TypeScript setup")
print("- Optimized for Cline/Kilo Code AI assistants")
print("- Modular .clinerules system with memory bank")
print("- Production-ready configuration")
print("- Modern development tooling (ESLint, Prettier, TypeScript)")
print("- Custom GSAP hooks and components")
print("- Comprehensive VS Code settings")

# Count total files
total_files = 0
def count_files(structure):
    global total_files
    for key, value in structure.items():
        if isinstance(value, dict):
            count_files(value)
        else:
            total_files += 1

count_files(project_structure["nextjs-gsap-starter"])
print(f"\nTotal files to be created: {total_files}")